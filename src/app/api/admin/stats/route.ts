import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        // Contadores básicos
        const users = await prisma.user.count();
        const sermons = await prisma.sermon.count();
        const activeUsers = await prisma.user.count({ where: { isActive: true } });

        // Assinaturas
        const totalSubscriptions = await prisma.subscription.count();
        const activeSubscriptions = await prisma.subscription.count({
            where: { status: 'ACTIVE' }
        });
        const cancelledSubscriptions = await prisma.subscription.count({
            where: { status: 'CANCELLED' }
        });

        // Receita (MRR - Monthly Recurring Revenue)
        const activeSubs = await prisma.subscription.findMany({
            where: { status: 'ACTIVE' },
            include: { plan: true }
        });

        const revenue = activeSubs.reduce((total, sub) => {
            const planPrice = sub.plan.price;
            // Se for anual, divide por 12 para obter MRR
            const monthlyValue = sub.plan.interval === 'YEARLY' ? planPrice / 12 : planPrice;
            return total + monthlyValue;
        }, 0);

        // Webhooks
        const totalWebhooks = await prisma.webhookEvent.count();
        const processedWebhooks = await prisma.webhookEvent.count({
            where: { processed: true }
        });
        const failedWebhooks = await prisma.webhookEvent.count({
            where: {
                processed: true,
                error: { not: null }
            }
        });

        // Growth Metrics
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Sermon Growth
        const sermonsThisWeek = await prisma.sermon.count({ where: { createdAt: { gte: oneWeekAgo } } });
        const sermonsLastWeek = await prisma.sermon.count({ where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } } });
        const sermonsGrowth = sermonsLastWeek === 0 ? (sermonsThisWeek > 0 ? 100 : 0) : Math.round(((sermonsThisWeek - sermonsLastWeek) / sermonsLastWeek) * 100);

        // MRR Growth (Approximation based on new subscriptions)
        const newSubsThisMonth = await prisma.subscription.findMany({
            where: { status: 'ACTIVE', createdAt: { gte: startOfMonth } },
            include: { plan: true }
        });
        const newRevenueThisMonth = newSubsThisMonth.reduce((acc, sub) => acc + (sub.plan.interval === 'YEARLY' ? sub.plan.price / 12 : sub.plan.price), 0);

        const newSubsLastMonth = await prisma.subscription.findMany({
            where: { status: 'ACTIVE', createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
            include: { plan: true }
        });
        const newRevenueLastMonth = newSubsLastMonth.reduce((acc, sub) => acc + (sub.plan.interval === 'YEARLY' ? sub.plan.price / 12 : sub.plan.price), 0);

        const mrrGrowth = newRevenueLastMonth === 0 ? (newRevenueThisMonth > 0 ? 100 : 0) : Math.round(((newRevenueThisMonth - newRevenueLastMonth) / newRevenueLastMonth) * 100);

        // Planos
        const plans = await prisma.plan.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { subscriptions: true }
                }
            }
        });

        return NextResponse.json({
            users,
            activeUsers,
            sermons,
            totalSubscriptions,
            activeSubscriptions,
            cancelledSubscriptions,
            revenue: Math.round(revenue),
            sermonsGrowth,
            mrrGrowth,
            totalWebhooks,
            processedWebhooks,
            failedWebhooks,
            plans: plans.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                subscribersCount: p._count.subscriptions
            }))
        });
    } catch (e: any) {
        console.error('Error fetching admin stats:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

