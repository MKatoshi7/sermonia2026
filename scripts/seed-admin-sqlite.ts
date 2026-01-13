import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('Seeding database...');

    const email = 'admin@sermonia.com';
    const password = '123';

    // Check if admin exists
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true
            }
        });
        console.log('✅ Admin user created: admin@sermonia.com / 123');
    } else {
        console.log('ℹ️ Admin user already exists');
    }
}

seed()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
