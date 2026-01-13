# ✅ PLANOS E WEBHOOK - COMPLETO

## 🎯 4 Planos Criados

Agora o sistema tem suporte completo para **4 tipos de planos**:

### 1. **Plano Mensal** 💰
- **Preço:** R$ 97,00/mês
- **Interval:** MONTHLY
- **Duração:** 1 mês renovável

### 2. **Plano Semestral** 📅
- **Preço:** R$ 497,00 (6 meses)
- **Interval:** SEMESTRAL  
- **Duração:** 6 meses
- **Economia:** ~83/mês (15% de desconto)

### 3. **Plano Anual** 🎁
- **Preço:** R$ 897,00 (12 meses)
- **Interval:** YEARLY
- **Duração:** 12 meses
- **Economia:** ~75/mês (23% de desconto)

### 4. **Plano Vitalício** 👑
- **Preço:** R$ 1.997,00 (pagamento único)
- **Interval:** LIFETIME
- **Duração:** INFINITO! (100 anos no sistema)
- **Sem mensalidades JAMAIS!**

---

## 🚀 Como Popular os Planos no Banco

### Opção 1: Via API (Recomendado)

**1. Acesse pelo navegador:**
```
http://localhost:3000/api/seed-plans
```

Isso criará os 4 planos automaticamente no PostgreSQL!

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Planos criados com sucesso!",
  "plans": [
    { "id": "uuid-1", "name": "Plano Mensal", "price": 97, "interval": "MONTHLY" },
    { "id": "uuid-2", "name": "Plano Semestral", "price": 497, "interval": "SEMESTRAL" },
    { "id": "uuid-3", "name": "Plano Anual", "price": 897, "interval": "YEARLY" },
    { "id": "uuid-4", "name": "Plano Vitalício", "price": 1997, "interval": "LIFETIME" }
  ]
}
```

**2. Via Postman/Insomnia:**
```
POST http://localhost:3000/api/seed-plans
```

---

## 🔍 WEBHOOK - DETECÇÃO AUTOMÁTICA DE PLANO

### Como Funciona:

O webhook agora **detecta automaticamente** qual plano deve ser associado ao usuário baseado no **nome do produto** enviado pela plataforma de pagamento!

### Palavras-Chave Detectadas:

| Palavras no Nome do Produto | Plano Detectado |
|------------------------------|-----------------|
| "vitalício", "vitalicio", "lifetime" | Plano Vitalício |
|"anual", "yearly", "12 meses", "ano" | Plano Anual |
| "semestral", "6 meses", "semestre" | Plano Semestral |
| "mensal", "monthly", "mês", "mes" | Plano Mensal |

### Exemplos de Nomes de Produtos:

✅ **"Sermonia Vitalício"** → Detecta Plano Vitalício  
✅ **"Acesso Anual Premium"** → Detecta Plano Anual  
✅ **"Plano Semestral"** → Detecta Plano Semestral  
✅ **"Assinatura Mensal"** → Detecta Plano Mensal  

### Fallback por Valor:

Se não encontrar palavras-chave, detecta pelo valor:
- **≥ R$ 1.500** → Vitalício
- **≥ R$ 800** → Anual
- **≥ R$ 400** → Semestral
- **< R$ 400** → Mensal

---

## 📋 Fluxo Completo do Webhook

```
[Webhook recebido da Hotmart/Stripe]
           ↓
[Extrai nome do produto: "Sermonia Anual"]
           ↓
[Detecta palavra-chave: "anual"]
           ↓
[Busca plano com interval = 'YEARLY']
           ↓
[Encontra "Plano Anual" no banco]
           ↓
[Cria usuário (se não existir)]
           ↓
[Cria assinatura ACTIVE]
   - planId: id-do-plano-anual
   - nextBillingDate: +12 meses
           ↓
[✅ Usuário ativo com Plano Anual!]
```

---

## 🐛 CORREÇÃO DO ERRO "phone"

### Problema:
```
Unknown argument `phone`. Did you mean `role`?
```

### Causa:
O Prisma Client não estava atualizado após adicionar o campo `phone` ao schema.

### Solução Aplicada:
```bash
npx prisma generate
```

✅ **Prisma Client regenerado!** Agora o campo `phone` funciona!

---

## 🔧 Arquivos Modificados/Criados

### 1. **API de Seed**
**Arquivo:** `src/app/api/seed-plans/route.ts`
- POST → Cria os 4 planos
- GET → Lista planos criados

### 2. **Webhook Atualizado**
**Arquivo:** `src/app/api/webhook/purchase/route.ts`
- ✅ Detecta plano pelo nome do produto
- ✅ Função `detectPlanByProductName()`  
- ✅ Função `detectInterval()`
- ✅ Função `getPlanDurationMonths()`
- ✅ Suporta os 4 intervalos: MONTHLY, SEMESTRAL, YEARLY, LIFETIME

### 3. **Schema Prisma**
**Arquivo:** `prisma/schema.prisma`
- ✅ Campo `phone` no User (já existia)
- ✅ Campo `interval` no Plan suporta 4 valores

---

## 📊 Exemplo de Payload de Webhook

### Hotmart:
```json
{
  "source": "HOTMART",
  "event": "PURCHASE_COMPLETED",
  "data": {
    "buyer": {
      "email": "cliente@email.com",
      "name": "João Silva",
      "phone": "+55 11 99999-9999"
    },
    "product": {
      "name": "Sermonia Anual Premium"  ← Detecta "Anual"
    },
    "purchase": {
      "price": {
        "value": 897.00
      },
      "transaction": "HP12345678"
    }
  }
}
```

**Resultado:**
- ✅ Cria usuário João Silva
- ✅ Detecta Plano Anual (pela palavra "Anual")
- ✅ Cria assinatura de 12 meses
- ✅ nextBillingDate = +12 meses

---

## ✅ Checklist

- ✅ Campo `phone` adicionado ao User
- ✅ Prisma Client regenerado (`npx prisma generate`)
- ✅ 4 planos configurados (Mensal, Semestral, Anual, Vitalício)
- ✅ API `/api/seed-plans` para popular planos
- ✅ Webhook detecta plano pelo nome do produto
- ✅ Webhook suporta fallback por valor
- ✅ Duração correta calculada (1, 6, 12 meses, vitalício)
- ✅ NextBillingDate = null para plano vitalício

---

## 🎉 PRÓXIMOS PASSOS

### 1. **Popular os Planos**
Acesse: `http://localhost:3000/api/seed-plans`

### 2. **Testar Adicionar Usuário**
Vá em `/dash` → Usuários → Adicionar Usuário  
Agora funcionará corretamente!

### 3. **Testar Webhook**
Envie um webhook de teste com nome do produto contendo:
- "Mensal" → Associa ao Plano Mensal
- "Semestral" → Associa ao Plano Semestral
- "Anual" → Associa ao Plano Anual
- "Vitalício" → Associa ao Plano Vitalício

---

## 🚀 TUDO PRONTO!

**O sistema agora:**
- ✅ Tem 4 planos configurados
- ✅ Detecta automaticamente o plano pelo nome do produto
- ✅ Cria usuários com telefone
- ✅ Calcula duração e next billing corretamente
- ✅ Suporta plano vitalício (lifetime)

**Basta popular os planos e testar!** 🎯
