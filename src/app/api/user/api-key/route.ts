import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * GET - Buscar API Key do usuário
 */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        // Pega userId do token (pode ser userId ou id)
        const userId = (decoded as any).userId || (decoded as any).id;

        if (!userId) {
            console.error('Token sem userId:', decoded);
            return NextResponse.json({ error: 'Token inválido - sem ID' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { apiKey: true }
        });

        return NextResponse.json({
            apiKey: user?.apiKey || ''
        });

    } catch (error: any) {
        console.error('Get API key error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST - Salvar/Atualizar API Key do usuário
 */
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const { apiKey } = await request.json();

        // Pega userId do token
        const userId = (decoded as any).userId || (decoded as any).id;

        if (!userId) {
            console.error('Token sem userId:', decoded);
            return NextResponse.json({ error: 'Token inválido - sem ID' }, { status: 401 });
        }

        // Atualiza a API Key do usuário
        await prisma.user.update({
            where: { id: userId },
            data: { apiKey }
        });

        return NextResponse.json({
            success: true,
            message: 'API Key salva com sucesso!'
        });

    } catch (error: any) {
        console.error('Save API key error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
