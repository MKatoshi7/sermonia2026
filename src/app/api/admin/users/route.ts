import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET - Listar todos os usuários
export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            include: {
                subscriptions: {
                    include: {
                        plan: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
                _count: {
                    select: {
                        sermons: true,
                        subscriptions: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Remove senhas da resposta
        const safeUsers = users.map(u => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });

        return NextResponse.json(safeUsers);
    } catch (e: any) {
        console.error('Error fetching users:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST - Criar novo usuário
export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const { email, name, phone, role, planId } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
        }

        // Verifica se já existe
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
        }

        // Gera senha temporária
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Cria usuário
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                role: role || 'USER',
                password: hashedPassword,
                needsPasswordSet: true,
                isActive: true
            }
        });

        // Se tiver plano, cria assinatura
        if (planId) {
            const nextBillingDate = new Date();
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

            await prisma.subscription.create({
                data: {
                    userId: newUser.id,
                    planId,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    nextBillingDate
                }
            });
        }

        const { password, ...userWithoutPassword } = newUser;

        return NextResponse.json({
            ...userWithoutPassword,
            tempPassword // Retorna senha temporária uma única vez
        });
    } catch (e: any) {
        console.error('Error creating user:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
