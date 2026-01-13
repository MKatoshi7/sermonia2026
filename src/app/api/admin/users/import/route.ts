import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        // Auth check
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string' || (decoded as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const users = body.users;

        if (!users || !Array.isArray(users)) {
            return NextResponse.json({ error: 'Invalid data format. Expected "users" array.' }, { status: 400 });
        }

        let createdCount = 0;
        let skippedCount = 0;
        let errors: string[] = [];

        for (let i = 0; i < users.length; i++) {
            const { name, email, phone } = users[i];

            if (!email || !email.includes('@')) {
                errors.push(`Row ${i + 1}: Invalid email (${email})`);
                continue;
            }

            try {
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    skippedCount++;
                } else {
                    await prisma.user.create({
                        data: {
                            name: name || email.split('@')[0],
                            email,
                            phone: phone || '',
                            password: null, // User must set password
                            needsPasswordSet: true,
                            role: 'USER',
                            isActive: true
                        }
                    });
                    createdCount++;
                }
            } catch (e: any) {
                errors.push(`Row ${i + 1} (${email}): ${e.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            created: createdCount,
            skipped: skippedCount,
            errors
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
