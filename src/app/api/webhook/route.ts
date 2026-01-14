import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        // Determine Source
        let source = 'UNKNOWN';
        if (payload.hottok || (payload.event && payload.data && payload.data.product)) {
            source = 'HOTMART';
        } else if (payload.event === 'purchase_approved' || payload.status) {
            // GCheckout usually has these fields, but it's less unique. 
            // We can assume GCheckout if it's not Hotmart for now, or check specific fields.
            source = 'GCHECKOUT';
        }

        // 1. Log the event
        const eventLog = await prisma.webhookEvent.create({
            data: {
                source: source,
                eventType: payload.event || payload.status || 'UNKNOWN',
                payload: JSON.stringify(payload),
                processed: false
            }
        });

        // 2. Process based on Source
        if (source === 'HOTMART') {
            return await processHotmart(payload, eventLog.id);
        } else {
            // Default to GCheckout/Generic logic
            return await processGCheckout(payload, eventLog.id);
        }

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function processHotmart(payload: any, eventLogId: string) {
    // Hotmart structure: data -> purchase -> status
    const status = payload.data?.purchase?.status;
    const buyer = payload.data?.buyer;

    // Check for APPROVED status
    const isApproved = status === 'APPROVED';

    if (!buyer?.email) {
        await prisma.webhookEvent.update({
            where: { id: eventLogId },
            data: { error: 'Email not found in payload', processed: true }
        });
        return NextResponse.json({ success: true, message: 'Logged but email missing' });
    }

    const email = buyer.email;
    const name = buyer.name || email.split('@')[0];
    const phone = buyer.checkout_phone || '';

    if (isApproved) {
        await createOrUpdateUserAndSubscription(email, name, phone, payload.id || '');
    } else if (['REFUNDED', 'CHARGEBACK', 'CANCELED'].includes(status)) {
        await cancelSubscription(email);
    }

    // Update log
    await prisma.webhookEvent.update({
        where: { id: eventLogId },
        data: { processed: true }
    });

    return NextResponse.json({ success: true });
}

async function processGCheckout(payload: any, eventLogId: string) {
    const email = payload.email || payload.customer?.email || payload.buyer?.email;
    const name = payload.name || payload.customer?.name || payload.buyer?.name;
    const phone = payload.phone || payload.customer?.phone || payload.buyer?.phone || payload.customer?.mobile;
    const status = payload.status || payload.transaction?.status || payload.current_status;

    const statusLower = String(status).toLowerCase();
    const isApproved = ['paid', 'approved', 'completed', 'succeeded', 'authorized'].includes(statusLower);

    if (!email) {
        await prisma.webhookEvent.update({
            where: { id: eventLogId },
            data: { error: 'Email not found in payload', processed: true }
        });
        return NextResponse.json({ success: true, message: 'Logged but email missing' });
    }

    if (isApproved) {
        await createOrUpdateUserAndSubscription(email, name, phone, payload.id || payload.transaction_id || '');
    } else if (['refunded', 'chargedback', 'cancelled'].includes(statusLower)) {
        await cancelSubscription(email);
    }

    // Update log
    await prisma.webhookEvent.update({
        where: { id: eventLogId },
        data: { processed: true }
    });

    return NextResponse.json({ success: true });
}

async function createOrUpdateUserAndSubscription(email: string, name: string, phone: string, externalId: string) {
    // 3. Find or Create User
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        // Create new user
        user = await prisma.user.create({
            data: {
                name: name || email.split('@')[0],
                email,
                phone: phone || '',
                password: null, // Needs to set password
                needsPasswordSet: true,
                role: 'USER',
                isActive: true
            }
        });
    } else {
        // Update user if needed (e.g. phone)
        if (phone && !user.phone) {
            await prisma.user.update({ where: { id: user.id }, data: { phone } });
        }
        // Ensure active
        if (!user.isActive) {
            await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });
        }
    }

    // 4. Create/Update Subscription
    // Find a plan. Default to the first active plan.
    const plan = await prisma.plan.findFirst({ where: { isActive: true } });

    if (plan) {
        // Check if active subscription exists
        const existingSub = await prisma.subscription.findFirst({
            where: { userId: user.id, status: 'ACTIVE' }
        });

        if (!existingSub) {
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    planId: plan.id,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    externalId: String(externalId)
                }
            });
        }
    }
}

async function cancelSubscription(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        // Deactivate subscription
        await prisma.subscription.updateMany({
            where: { userId: user.id, status: 'ACTIVE' },
            data: { status: 'CANCELLED', cancelledAt: new Date() }
        });
    }
}
