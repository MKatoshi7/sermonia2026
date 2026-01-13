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

        const logs = await prisma.webhookEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json(logs);

    } catch (error: any) {
        console.error('Webhook logs error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
