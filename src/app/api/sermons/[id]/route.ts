import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { title, content } = await request.json();

        // Verify ownership
        const existingSermon = await prisma.sermon.findUnique({
            where: { id }
        });

        if (!existingSermon || existingSermon.userId !== (user as any).userId && existingSermon.userId !== (user as any).id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const sermon = await prisma.sermon.update({
            where: { id },
            data: {
                title,
                content: JSON.stringify(content)
            }
        });

        return NextResponse.json(sermon);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Verify ownership
        const sermon = await prisma.sermon.findUnique({
            where: { id }
        });

        if (!sermon || sermon.userId !== (user as any).userId && sermon.userId !== (user as any).id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        await prisma.sermon.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
