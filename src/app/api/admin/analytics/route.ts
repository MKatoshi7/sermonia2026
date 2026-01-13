import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || (decoded as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const period = parseInt(searchParams.get('period') || '30');

        // Data de início do período
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - period);

        // Total de usuários
        const totalUsers = await prisma.user.count();

        // Assinaturas ativas
        const activeSubscriptions = await prisma.subscription.count({
            where: {
                status: 'active',
                OR: [
                    { nextBillingDate: { gte: new Date() } },
                    { nextBillingDate: null } // Vitalício
                ]
            }
        });

        // Receita total
        const subscriptions = await prisma.subscription.findMany({
            where: { status: 'active' },
            include: { plan: true }
        });
        const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.plan.price, 0);

        // Total de sermões
        const totalSermons = await prisma.sermon.count();

        // Novos usuários no período
        const newUsersThisPeriod = await prisma.user.count({
            where: {
                createdAt: { gte: startDate }
            }
        });

        // Usuários ativos hoje (criaram sermão hoje)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeUsersToday = await prisma.sermon.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: today }
            },
            _count: true
        });

        // Taxa de conversão
        const usersWithSubscription = await prisma.user.count({
            where: {
                subscriptions: { some: { status: 'active' } }
            }
        });
        const conversionRate = totalUsers > 0 ? ((usersWithSubscription / totalUsers) * 100).toFixed(1) : 0;

        // Taxa de churn (simplificado)
        const cancelledSubscriptions = await prisma.subscription.count({
            where: { status: 'cancelled' }
        });
        const churnRate = (activeSubscriptions + cancelledSubscriptions) > 0
            ? ((cancelledSubscriptions / (activeSubscriptions + cancelledSubscriptions)) * 100).toFixed(1)
            : 0;

        // Distribuição de planos
        const planDistribution = await prisma.subscription.groupBy({
            by: ['planId'],
            where: { status: 'active' },
            _count: true
        });

        const planDistributionWithNames = await Promise.all(
            planDistribution.map(async (item) => {
                const plan = await prisma.plan.findUnique({ where: { id: item.planId } });
                return {
                    name: plan?.name || 'Desconhecido',
                    count: item._count
                };
            })
        );

        // Receita por plano
        const revenueByPlan = await Promise.all(
            planDistribution.map(async (item) => {
                const plan = await prisma.plan.findUnique({ where: { id: item.planId } });
                return {
                    name: plan?.name || 'Desconhecido',
                    revenue: (plan?.price || 0) * item._count
                };
            })
        );

        // Crescimento de usuários (últimos 12 meses)
        const userGrowth = [];
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);

            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);

            const count = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: monthStart,
                        lt: monthEnd
                    }
                }
            });

            userGrowth.push({
                month: monthStart.toLocaleDateString('pt-BR', { month: 'short' }),
                count
            });
        }

        // Sermões por usuário
        const sermonsPerUser = totalUsers > 0 ? totalSermons / totalUsers : 0;

        return NextResponse.json({
            totalUsers,
            activeSubscriptions,
            totalRevenue,
            totalSermons,
            newUsersThisPeriod,
            activeUsersToday: activeUsersToday.length,
            conversionRate: parseFloat(conversionRate as string),
            churnRate: parseFloat(churnRate as string),
            planDistribution: planDistributionWithNames,
            revenueByPlan,
            userGrowth,
            sermonsPerUser: parseFloat(sermonsPerUser.toFixed(1))
        });

    } catch (error: any) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
