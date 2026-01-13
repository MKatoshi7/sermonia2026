const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const events = await prisma.webhookEvent.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        console.log('Últimos 5 Webhooks:');
        events.forEach(e => {
            console.log('--------------------------------------------------');
            console.log(`ID: ${e.id}`);
            console.log(`Data: ${e.createdAt}`);
            console.log(`Evento: ${e.eventType}`);
            console.log(`Processado: ${e.processed}`);
            console.log(`Erro: ${e.error}`);
            console.log(`Payload: ${e.payload.substring(0, 500)}...`); // Mostrar início do payload
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
