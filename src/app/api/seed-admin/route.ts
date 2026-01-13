import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const email = "admin@sermonia.com";
        const password = "123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: "Admin User",
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        return NextResponse.json({ message: 'Admin seeded', user });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
