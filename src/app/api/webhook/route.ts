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
        // Extract data based on GCheckout structure provided by user
        const customer = payload.customer || {};
        const email = customer.email || payload.email || payload.buyer?.email;

        // User Name: prioritize customer object
        let userName = customer.name || payload.buyer?.name;
        // If no customer object, maybe payload.name is the user, but user said payload.name is product. 
        // So we trust customer.name first.

        const phone = customer.phone || customer.mobile || payload.phone || payload.buyer?.phone;
        const document = customer.document || payload.document; // CPF/CNPJ
        const ip = customer.ip || payload.ip;
        const purchaseDate = payload.createdAt ? new Date(payload.createdAt) : new Date();

        const status = payload.status || payload.transaction?.status || payload.current_status;

        // Extract Product Name
        // User specified: "name": "SermonIA Pro" at root is the product name
        let productName = payload.product_name || payload.product?.name || payload.offer?.title;
        if (!productName && payload.name) {
            productName = payload.name;
        }
        if (!productName) productName = 'Plano Padrão';

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
                        name: userName || email.split('@')[0],
                        email,
                        phone: phone || '',
                        document: document || null,
                        ip: ip || null,
                        password: null, // Needs to set password
                        needsPasswordSet: true,
                        role: 'USER',
                        isActive: true
                    }
                });
            } else {
                // Update user if needed
                const updateData: any = {};
                if (phone && !user.phone) updateData.phone = phone;
                if (document && !user.document) updateData.document = document;
                if (ip) updateData.ip = ip; // Update IP on new purchase

                if (Object.keys(updateData).length > 0) {
                    await prisma.user.update({ where: { id: user.id }, data: updateData });
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
                            startDate: purchaseDate, // Use purchase date from webhook
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
