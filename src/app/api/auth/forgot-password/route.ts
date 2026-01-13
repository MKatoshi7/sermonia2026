import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ success: true });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // In a real app, send email here
        console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
        console.log(`[DEV] Reset Link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
