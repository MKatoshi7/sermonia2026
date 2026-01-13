import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        // Await params no Next.js 15+
        const { id } = await params;

        // Deleta o sermão
        await prisma.sermon.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Sermão deletado com sucesso'
        });

    } catch (error: any) {
        console.error('Delete sermon error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
