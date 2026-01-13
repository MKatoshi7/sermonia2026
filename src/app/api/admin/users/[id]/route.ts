import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// PUT - Atualizar usuário
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const { id } = await params;
        const data = await request.json();

        const updateData: any = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            isActive: data.isActive
        };

        if (data.password && data.password.trim() !== '') {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        const { password, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(userWithoutPassword);
    } catch (e: any) {
        console.error('Error updating user:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE - Remover usuário
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const { id } = await params;

        // Deleta usuário (cascade vai deletar sermões e assinaturas)
        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Usuário removido com sucesso' });
    } catch (e: any) {
        console.error('Error deleting user:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
