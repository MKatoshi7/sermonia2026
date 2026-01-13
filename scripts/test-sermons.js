const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'sermonia-secret-key';

async function test() {
    try {
        // 1. Create or get user
        const email = 'test@example.com';
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    password: 'hashedpassword',
                    role: 'USER'
                }
            });
            console.log('User created');
        } else {
            console.log('User found');
        }

        // 2. Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
        console.log('Token generated');

        // 3. Create Sermon via Prisma (simulating API logic)
        const sermon = await prisma.sermon.create({
            data: {
                title: 'Test Sermon',
                content: JSON.stringify({ title: 'Test Sermon', points: [] }),
                userId: user.id
            }
        });
        console.log('Sermon created:', sermon.id);

        // 4. List Sermons via Prisma
        const sermons = await prisma.sermon.findMany({
            where: { userId: user.id }
        });
        console.log('Sermons found:', sermons.length);

        if (sermons.length > 0) {
            console.log('First sermon title:', sermons[0].title);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
