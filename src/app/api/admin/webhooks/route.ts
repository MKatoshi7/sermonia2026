import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;

    if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const events = await prisma.webhookEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching webhooks:', error);
        return NextResponse.json({ error: 'Error fetching webhooks' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;

    if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.webhookEvent.deleteMany({});
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing webhooks:', error);
        return NextResponse.json({ error: 'Error clearing webhooks' }, { status: 500 });
    }
}
