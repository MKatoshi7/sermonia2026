import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        // 1. Log the event
        const eventLog = await prisma.webhookEvent.create({
            data: {
                source: 'GCHECKOUT_MAIN',
                eventType: payload.event || payload.status || 'UNKNOWN',
                payload: JSON.stringify(payload),
                processed: false
            }
        });

        // 2. Process the event
        // Extract user info. GCheckout/Green usually sends flattened or nested data.
        const email = payload.email || payload.customer?.email || payload.buyer?.email;
        const name = payload.name || payload.customer?.name || payload.buyer?.name;
        const phone = payload.phone || payload.customer?.phone || payload.buyer?.phone || payload.customer?.mobile;
        const status = payload.status || payload.transaction?.status || payload.current_status;

        // Extract Product Name for categorization
        const productName = payload.product_name || payload.product?.name || payload.offer?.title || 'Plano Padrão';

        // GCheckout specific: 'paid', 'approved', 'authorized'
        const statusLower = String(status).toLowerCase();
        const isApproved = ['paid', 'approved', 'completed', 'succeeded', 'authorized'].includes(statusLower);

        if (!email) {
            await prisma.webhookEvent.update({
                where: { id: eventLog.id },
                data: { error: 'Email not found in payload', processed: true }
            });
            return NextResponse.json({ success: true, message: 'Logged but email missing' });
        }

        if (isApproved) {
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

            // 4. Create/Update Subscription based on Product Name
            // Try to find a plan that matches the product name (fuzzy match or exact)
            let plan = await prisma.plan.findFirst({
                where: {
                    name: {
                        contains: productName,
                        mode: 'insensitive'
                    },
                    isActive: true
                }
            });

            // If no specific plan found, fallback to any active plan (or a default one)
            if (!plan) {
                console.warn(`Plan not found for product: ${productName}. Using default.`);
                plan = await prisma.plan.findFirst({ where: { isActive: true } });
            }

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
                            externalId: String(payload.id || payload.transaction_id || payload.code || '')
                        }
                    });
                } else {
                    // Update existing subscription if needed (e.g. upgrade plan)
                    if (existingSub.planId !== plan.id) {
                        await prisma.subscription.update({
                            where: { id: existingSub.id },
                            data: { planId: plan.id }
                        });
                    }
                }
            }
        } else if (['refunded', 'chargedback', 'cancelled'].includes(statusLower)) {
            // Handle cancellation/refund
            const user = await prisma.user.findUnique({ where: { email } });
            if (user) {
                // Deactivate subscription
                await prisma.subscription.updateMany({
                    where: { userId: user.id, status: 'ACTIVE' },
                    data: { status: 'CANCELLED', cancelledAt: new Date() }
                });
            }
        }

        // Update log
        await prisma.webhookEvent.update({
            where: { id: eventLog.id },
            data: { processed: true }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
