import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;

    if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userIds } = await req.json();

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'No users provided' }, { status: 400 });
        }

        // Prevent deleting self
        if (userIds.includes(decoded.id)) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        await prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error bulk deleting users:', error);
        return NextResponse.json({ error: 'Error deleting users' }, { status: 500 });
    }
}
