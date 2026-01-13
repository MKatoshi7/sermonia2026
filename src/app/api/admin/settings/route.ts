import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const settings = await prisma.systemSetting.findMany();
        // Convert array to object for easier consumption
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(settingsMap);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    if (!user || (user as any).role !== 'ADMIN') {
        return new NextResponse(null, { status: 403 });
    }

    try {
        const body = await request.json();
        const { key, value, description } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
        }

        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });

        return NextResponse.json(setting);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
