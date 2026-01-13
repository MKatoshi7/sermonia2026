import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || typeof decoded === 'string') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, content } = await request.json();

        const sermon = await prisma.sermon.create({
            data: {
                title,
                content: JSON.stringify(content),
                userId: (decoded as any).userId || (decoded as any).id
            }
        });
        return NextResponse.json(sermon);
    } catch (e: any) {
        console.error('Error creating sermon:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const userId = (decoded as any).userId || (decoded as any).id;
        const sermons = await prisma.sermon.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        const formatted = sermons.map(s => ({ ...s, content: JSON.parse(s.content) }));
        return NextResponse.json(formatted);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
