import prisma from '../src/lib/prisma';

async function main() {
    console.log('Testing Prisma connection...');
    try {
        const count = await prisma.user.count();
        console.log(`✅ Connection successful! User count: ${count}`);
    } catch (e: any) {
        console.error('❌ Prisma connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
