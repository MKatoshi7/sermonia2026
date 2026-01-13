import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
        }

        if (!user.password) {
            return NextResponse.json({ message: "Usuário sem senha configurada" }, { status: 401 });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Senha incorreta" }, { status: 401 });
        }

        const token = signToken({ id: user.id, role: user.role });
        // Remove password from response
        const { password: _, ...userSafe } = user;

        return NextResponse.json({ user: userSafe, token });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
