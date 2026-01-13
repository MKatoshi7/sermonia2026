import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Listar todos os planos
export async function GET(request: Request) {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                _count: {
                    select: { subscriptions: true }
                }
            },
            orderBy: {
                price: 'asc'
            }
        });

        return NextResponse.json(plans);
    } catch (e: any) {
        console.error('Error fetching plans:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST - Criar novo plano
export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const { name, description, price, interval, features } = await request.json();

        if (!name || !price) {
            return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 });
        }

        const plan = await prisma.plan.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                interval: interval || 'MONTHLY',
                features: typeof features === 'string' ? features : JSON.stringify(features),
                isActive: true
            }
        });

        return NextResponse.json(plan);
    } catch (e: any) {
        console.error('Error creating plan:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
