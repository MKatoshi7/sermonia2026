import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';

/**
 * API para importar usuários via CSV
 * Formato: nome,email,telefone
 */
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || (decoded as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const { csvData } = await request.json();

        if (!csvData || !Array.isArray(csvData)) {
            return NextResponse.json({
                error: 'Dados CSV inválidos. Esperado array de objetos.'
            }, { status: 400 });
        }

        const results = {
            total: csvData.length,
            success: 0,
            errors: [] as any[]
        };

        // Gera senha temporária padrão
        const tempPassword = 'senha123'; // Será obrigado a trocar
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        for (const row of csvData) {
            try {
                const { nome, email, telefone } = row;

                if (!email) {
                    results.errors.push({
                        row,
                        error: 'Email é obrigatório'
                    });
                    continue;
                }

                // Verifica se já existe
                const existing = await prisma.user.findUnique({
                    where: { email }
                });

                if (existing) {
                    results.errors.push({
                        row,
                        error: 'Email já cadastrado'
                    });
                    continue;
                }

                // Cria usuário
                await prisma.user.create({
                    data: {
                        email,
                        name: nome || null,
                        phone: telefone || null,
                        password: hashedPassword,
                        needsPasswordSet: true, // Força troca de senha
                        isActive: true,
                        role: 'USER'
                    }
                });

                results.success++;

            } catch (error: any) {
                results.errors.push({
                    row,
                    error: error.message
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Importação concluída: ${results.success} de ${results.total} usuários criados`,
            results
        });

    } catch (error: any) {
        console.error('Import users error:', error);
        return NextResponse.json({
            error: 'Erro ao importar usuários'
        }, { status: 500 });
    }
}
