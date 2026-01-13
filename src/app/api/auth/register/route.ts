import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 });
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json({ error: 'A senha deve ter no mínimo 8 caracteres' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Check if this is a pre-registered user claiming their account (first access)
            if (existingUser.needsPasswordSet) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const updatedUser = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        password: hashedPassword,
                        needsPasswordSet: false,
                        name: name || existingUser.name, // Update name if provided
                        isActive: true
                    }
                });

                const token = signToken({ id: updatedUser.id, role: updatedUser.role });
                const { password: _, ...userSafe } = updatedUser;

                return NextResponse.json({
                    success: true,
                    message: 'Senha criada com sucesso! Você já pode acessar o Sermonia.',
                    user: userSafe,
                    token
                });
            }

            return NextResponse.json({ error: 'Este e-mail já possui uma conta ativa. Faça login ou recupere sua senha.' }, { status: 400 });
        }

        // If user doesn't exist and trying to register without webhook, require name
        if (!name) {
            return NextResponse.json({ error: 'Nome é obrigatório para novos cadastros' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Default role
                isActive: true
            }
        });

        // Generate token for auto-login
        const token = signToken({ id: user.id, role: user.role });

        // Remove password from response
        const { password: _, ...userSafe } = user;

        return NextResponse.json({
            success: true,
            user: userSafe,
            token
        });

    } catch (error: any) {
        console.error('Registration error details:', error);
        return NextResponse.json({ error: `Erro ao criar conta: ${error.message}` }, { status: 500 });
    }
}
