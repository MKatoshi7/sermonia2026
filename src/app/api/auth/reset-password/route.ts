import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para resetar senha usando token
 */
export async function POST(request: Request) {
    try {
        const { token, email, newPassword } = await request.json();

        if (!token || !email || !newPassword) {
            return NextResponse.json({
                error: 'Token, email e nova senha são obrigatórios'
            }, { status: 400 });
        }

        // Busca usuário com token válido
        const user = await prisma.user.findFirst({
            where: {
                email,
                resetToken: token,
                resetTokenExpiry: {
                    gte: new Date() // Token ainda não expirou
                }
            }
        });

        if (!user) {
            return NextResponse.json({
                error: 'Token inválido ou expirado'
            }, { status: 400 });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza senha e limpa token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                needsPasswordSet: false
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({
            error: 'Erro ao resetar senha'
        }, { status: 500 });
    }
}
