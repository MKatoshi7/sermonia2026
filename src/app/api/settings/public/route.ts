import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany({
            where: {
                key: { in: ['image_gen_pre_prompt', 'feature_image_generation_enabled'] }
            }
        });

        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(settingsMap);
    } catch (e) {
        return NextResponse.json({});
    }
}
