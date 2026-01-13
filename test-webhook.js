// Script de teste para o webhook da GGCheckout
// Execute com: node test-webhook.js

const testPayload = {
    "Nome do Produto": "SermonIA PRO - Acesso Vitalício",
    "Nome": "Teste Webhook",
    "Email": "teste.webhook@example.com",
    "DDD": "11",
    "Telefone": "999888777",
    "Status": "approved",
    "Transação": "TEST_TXN_" + Date.now(),
    "Meio de Pagamento": "Cartão de Crédito",
    "Preço do Produto": "297.00",
    "Data de Venda": new Date().toISOString(),
    "Data de Confirmação": new Date().toISOString()
};

async function testWebhook() {
    console.log('🧪 Testando webhook da GGCheckout...\n');
    console.log('📤 Enviando payload:');
    console.log(JSON.stringify(testPayload, null, 2));
    console.log('\n');

    try {
        const response = await fetch('http://localhost:3000/api/webhook/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        });

        const data = await response.json();

        console.log('📥 Resposta recebida:');
        console.log('Status:', response.status);
        console.log('Dados:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('\n✅ SUCESSO!');
            console.log(`   User ID: ${data.userId}`);
            console.log(`   Usuário criado: ${data.userCreated ? 'SIM' : 'NÃO (já existia)'}`);
            console.log(`   Assinatura criada: ${data.subscriptionCreated ? 'SIM' : 'NÃO (já existia)'}`);
        } else {
            console.log('\n❌ ERRO:', data.error);
        }

    } catch (error) {
        console.error('💥 Erro ao testar webhook:', error.message);
    }
}

// Executar teste
testWebhook();
