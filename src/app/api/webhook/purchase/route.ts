import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Webhook para processar eventos de compra da GGCheckout
 * Cria usuários automaticamente com plano SermonIA PRO (vitalício)
 * Extrai: Nome, Email, Telefone, Nome do Produto
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('📥 [WEBHOOK] Recebido:', JSON.stringify(body, null, 2));

        // Criar log do webhook
        const webhookEvent = await prisma.webhookEvent.create({
            data: {
                source: 'GGCHECKOUT',
                eventType: body.event || body.status || 'PURCHASE',
                payload: JSON.stringify(body),
                processed: false
            }
        });

        console.log(`📝 [WEBHOOK] Log criado - ID: ${webhookEvent.id}`);

        // Processar compra da GGCheckout
        const result = await processGGCheckoutPurchase(body, webhookEvent.id);

        // Atualizar status do webhook
        await prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
                processed: !result.error,
                processedAt: new Date(),
                error: result.error || null
            }
        });

        if (result.error) {
            console.error(`❌ [WEBHOOK] Erro: ${result.error}`);
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        console.log(`✅ [WEBHOOK] Processado com sucesso - User ID: ${result.userId}`);
        return NextResponse.json({
            success: true,
            message: 'Webhook processado com sucesso',
            userId: result.userId,
            userCreated: result.userCreated,
            subscriptionCreated: result.subscriptionCreated
        });

    } catch (error: any) {
        console.error('💥 [WEBHOOK] Erro fatal:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

/**
 * Processa webhook da GGCheckout
 * Extrai: Nome, Email, Telefone, Nome do Produto
 * Cria usuário com plano SermonIA PRO (vitalício) por padrão
 */
async function processGGCheckoutPurchase(data: any, webhookId: string) {
    try {
        // Extrair dados do webhook
        const email = data.Email || data.email;
        const name = data.Nome || data.name || 'Novo Usuário';
        const phone = data.Telefone || data.phone || '';
        const ddd = data.DDD || data.ddd || '';
        const fullPhone = ddd ? `${ddd}${phone}` : phone;
        const productName = data['Nome do Produto'] || data.product_name || 'SermonIA PRO';

        console.log(`📋 [DADOS EXTRAÍDOS]`);
        console.log(`   Nome: ${name}`);
        console.log(`   Email: ${email}`);
        console.log(`   Telefone: ${fullPhone}`);
        console.log(`   Produto: ${productName}`);

        // Validar email
        if (!email) {
            const error = 'Email não encontrado no webhook';
            console.error(`❌ [VALIDAÇÃO] ${error}`);
            throw new Error(error);
        }

        console.log(`🔍 [VERIFICAÇÃO] Buscando usuário: ${email}`);

        // Verificar se usuário já existe
        let user = await prisma.user.findUnique({ where: { email } });
        let userCreated = false;

        if (!user) {
            console.log(`👤 [CRIAÇÃO] Usuário não existe, criando novo...`);

            // Criar senha temporária
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone: fullPhone,
                    password: hashedPassword,
                    needsPasswordSet: true,
                    isActive: true
                }
            });

            userCreated = true;
            console.log(`✅ [CRIAÇÃO] Usuário criado - ID: ${user.id}`);
        } else {
            console.log(`ℹ️ [VERIFICAÇÃO] Usuário já existe - ID: ${user.id}`);
        }

        // Buscar ou criar plano SermonIA PRO (vitalício)
        console.log(`🔍 [PLANO] Buscando plano vitalício...`);

        let plan = await prisma.plan.findFirst({
            where: {
                interval: 'LIFETIME',
                isActive: true
            }
        });

        if (!plan) {
            console.log(`📦 [PLANO] Criando plano SermonIA PRO...`);
            plan = await prisma.plan.create({
                data: {
                    name: 'SermonIA PRO',
                    description: 'Acesso vitalício ao SermonIA',
                    price: 0,
                    interval: 'LIFETIME',
                    features: JSON.stringify(['Acesso completo', 'Sermões ilimitados', 'Geração de imagens']),
                    isActive: true
                }
            });
            console.log(`✅ [PLANO] Plano criado - ID: ${plan.id}`);
        } else {
            console.log(`ℹ️ [PLANO] Plano encontrado - ${plan.name} (ID: ${plan.id})`);
        }

        // Verificar se já tem assinatura ativa
        const existingSub = await prisma.subscription.findFirst({
            where: {
                userId: user.id,
                status: 'ACTIVE'
            }
        });

        let subscriptionCreated = false;

        if (!existingSub) {
            console.log(`📝 [ASSINATURA] Criando assinatura vitalícia...`);

            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    planId: plan.id,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    nextBillingDate: null, // Vitalício não tem próxima cobrança
                    externalId: webhookId
                }
            });

            subscriptionCreated = true;
            console.log(`✅ [ASSINATURA] Assinatura criada com sucesso`);
        } else {
            console.log(`ℹ️ [ASSINATURA] Usuário já possui assinatura ativa`);
        }

        console.log(`🎉 [SUCESSO] Processamento concluído`);
        console.log(`   Usuário: ${userCreated ? 'CRIADO' : 'EXISTENTE'}`);
        console.log(`   Assinatura: ${subscriptionCreated ? 'CRIADA' : 'EXISTENTE'}`);
        console.log(`   Plano: ${plan.name}`);

        return {
            success: true,
            userId: user.id,
            userCreated,
            subscriptionCreated
        };

    } catch (error: any) {
        console.error('💥 [ERRO] Falha ao processar webhook:', error);
        return { error: error.message };
    }
}
