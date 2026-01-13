import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * API para popular os planos no banco de dados
 * GET ou POST: Cria os 4 planos se não existirem
 */
export async function GET() {
    return await seedPlans();
}

export async function POST() {
    return await seedPlans();
}

async function seedPlans() {
    try {
        // Verifica se já existem planos
        const existingPlans = await prisma.plan.findMany();

        if (existingPlans.length > 0) {
            return NextResponse.json({
                message: 'Planos já existem no banco de dados',
                count: existingPlans.length,
                plans: existingPlans.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    interval: p.interval,
                    isActive: p.isActive
                }))
            });
        }

        // Cria os 4 planos
        const plans = await Promise.all([
            // 1. Plano Mensal
            prisma.plan.create({
                data: {
                    name: 'Plano Mensal',
                    description: 'Acesso mensal ao Sermonia',
                    price: 97.00,
                    interval: 'MONTHLY',
                    features: JSON.stringify([
                        'Sermões ilimitados',
                        'IA para geração de conteúdo',
                        'Revisão de textos',
                        'Geração de imagens',
                        'Exportar em PDF',
                        'Suporte por email'
                    ]),
                    isActive: true
                }
            }),

            // 2. Plano Semestral
            prisma.plan.create({
                data: {
                    name: 'Plano Semestral',
                    description: 'Acesso semestral ao Sermonia (6 meses)',
                    price: 497.00,
                    interval: 'SEMESTRAL',
                    features: JSON.stringify([
                        'Todos os recursos do Mensal',
                        'Economia de 15%',
                        '6 meses de acesso garantido',
                        'Prioridade no suporte',
                        'Atualizações exclusivas'
                    ]),
                    isActive: true
                }
            }),

            // 3. Plano Anual
            prisma.plan.create({
                data: {
                    name: 'Plano Anual',
                    description: 'Acesso anual ao Sermonia (12 meses)',
                    price: 897.00,
                    interval: 'YEARLY',
                    features: JSON.stringify([
                        'Todos os recursos',
                        'Economia de 23%',
                        '12 meses de acesso garantido',
                        'Suporte prioritário',
                        'Treinamento gratuito',
                        'Atualizações vip'
                    ]),
                    isActive: true
                }
            }),

            // 4. Plano Vitalício
            prisma.plan.create({
                data: {
                    name: 'Plano Vitalício',
                    description: 'Acesso vitalício ao Sermonia',
                    price: 1997.00,
                    interval: 'LIFETIME',
                    features: JSON.stringify([
                        'Acesso VITALÍCIO',
                        'TODAS as funcionalidades',
                        'TODAS as atualizações futuras',
                        'Suporte VIP prioritário',
                        'Comunidade exclusiva',
                        'Treinamentos premium',
                        'Sem mensalidades NUNCA MAIS'
                    ]),
                    isActive: true
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            message: '✅ Planos criados com sucesso!',
            count: plans.length,
            plans: plans.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                interval: p.interval
            }))
        });

    } catch (error: any) {
        console.error('Error seeding plans:', error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
