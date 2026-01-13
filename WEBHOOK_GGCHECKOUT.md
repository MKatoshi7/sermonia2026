# Sistema de Webhook GGCheckout - Documentação

## 📋 Resumo das Mudanças

Sistema completo de integração com GGCheckout para criação automática de usuários via webhook e importação em lote via CSV.

---

## 🔗 Webhook Endpoint

### URL do Webhook
```
/api/webhook/purchase
```

### Configuração na GGCheckout
Configure esta URL na plataforma GGCheckout para receber eventos de compra automaticamente.

### Funcionamento

#### 1. **Recebimento do Evento**
- Webhook recebe dados da GGCheckout
- Cria log automático no banco de dados
- Extrai informações: Nome, Email, Telefone (DDD + Número), Nome do Produto

#### 2. **Processamento**
- ✅ Verifica se usuário já existe (por email)
- ✅ Se não existe, cria novo usuário com senha temporária
- ✅ Busca ou cria plano "SermonIA PRO" (vitalício)
- ✅ Cria assinatura ativa para o usuário
- ✅ Registra todos os passos no console com emojis

#### 3. **Logs Detalhados**
```
📥 [WEBHOOK] Recebido
📝 [WEBHOOK] Log criado - ID: xxx
📋 [DADOS EXTRAÍDOS]
   Nome: João Silva
   Email: joao@example.com
   Telefone: 11987654321
   Produto: SermonIA PRO
🔍 [VERIFICAÇÃO] Buscando usuário
👤 [CRIAÇÃO] Usuário criado - ID: xxx
🔍 [PLANO] Buscando plano vitalício
📝 [ASSINATURA] Criando assinatura vitalícia
✅ [ASSINATURA] Assinatura criada com sucesso
🎉 [SUCESSO] Processamento concluído
```

#### 4. **Resposta**
```json
{
  "success": true,
  "message": "Webhook processado com sucesso",
  "userId": "user-id",
  "userCreated": true,
  "subscriptionCreated": true
}
```

---

## 📊 Importação em Lote (CSV)

### Formato Esperado

**Primeira linha = Cabeçalho** (separado por ponto e vírgula `;`)

**Formato completo da GGCheckout (58 colunas):**

```
Nome do Produto;Nome do Produtor;Documento do Produtor;Nome do Afiliado;Transação;Meio de Pagamento;Origem;Moeda;Preço do Produto;Moeda;Preço da Oferta;Taxa de Câmbio;Moeda;Preço Original;Número da Parcela;Recorrência;Data de Venda;Data de Confirmação;Status;Nome;Documento;Email;DDD;Telefone;CEP;Cidade;Estado;Bairro;País;Endereço;Número;Complemento;chave;Código do Produto;Código da Afiliação;Código de Oferta;Origem de Checkout;Tipo de Pagamento;Período Grátis;Tem co-produção;Venda feita como;Preço Total;Tipo pagamento oferta;Taxa de Câmbio Real;Preço Total Convertido;Quantidade de itens;Oferta de Upgrade;Cupom;Moeda;Valor que você recebeu convertido;Taxa de Câmbio do valor recebido;Data Vencimento;Instagram;Origem da venda;Moeda de recebimento;Faturamento líquido;Código do assinante;Nota Fiscal;Valor do frete bruto
```

**Exemplo de linha de dados:**
```
SermonIA PRO;Katoshi;123.456.789-00;Afiliado 1;TXN001;Cartão de Crédito;Site;BRL;297.00;BRL;297.00;1.00;BRL;297.00;1;Única;13/01/2026;13/01/2026;Aprovado;João da Silva;111.222.333-44;joao.silva@example.com;11;987654321;01234-567;São Paulo;SP;Centro;Brasil;Rua A;100;Apto 1;chave123;PROD001;AFF001;OFFER001;Checkout;Cartão;0;Não;Produtor;297.00;À vista;1.00;297.00;1;Não;CUPOM10;BRL;280.00;1.00;13/02/2026;@joaosilva;Orgânico;BRL;280.00;SUB001;NF001;0.00
```

### Colunas Obrigatórias
- ✅ **Nome** - Nome completo do cliente (Coluna 20)
- ✅ **Email** - Email do cliente (Coluna 22) - usado como identificador único

### Colunas Opcionais
- **DDD** - Código de área do telefone (Coluna 23)
- **Telefone** - Número do telefone (Coluna 24)
- **Nome do Produto** - Nome do produto comprado (Coluna 1)

### Mapeamento de Colunas Principais

| Coluna | Nome | Descrição |
|--------|------|-----------|
| 1 | Nome do Produto | Produto adquirido pelo cliente |
| 20 | Nome | Nome completo do cliente ⭐ **OBRIGATÓRIO** |
| 21 | Documento | CPF/CNPJ do cliente |
| 22 | Email | Email do cliente ⭐ **OBRIGATÓRIO** |
| 23 | DDD | Código de área (ex: 11, 21, 85) |
| 24 | Telefone | Número do telefone sem DDD |

**Nota:** O sistema concatena automaticamente DDD + Telefone para criar o número completo.

### Processo de Importação

1. **Upload do CSV**
   - Faça upload do arquivo exportado da GGCheckout
   - Sistema valida automaticamente o formato

2. **Pré-visualização**
   - Exibe tabela com Nome, Email e Telefone
   - Mostra total de usuários válidos encontrados
   - Logs detalhados no console do navegador

3. **Confirmação**
   - Botão "Confirmar Importação"
   - Todos os usuários são criados com plano **SermonIA PRO (vitalício)**

4. **Resultado**
   - Mostra quantos usuários foram criados
   - Quantos foram pulados (já existiam)
   - Lista de erros (se houver)

---

## 🎯 Plano Padrão

### SermonIA PRO (Vitalício)

**Características:**
- ✅ Acesso vitalício
- ✅ Sermões ilimitados
- ✅ Geração de imagens com IA
- ✅ Sem próxima data de cobrança
- ✅ Status: ATIVO

**Criação Automática:**
- Se o plano não existir, é criado automaticamente
- Todos os usuários criados via webhook ou CSV recebem este plano

---

## 📱 Admin Dashboard

### Monitor de Webhooks

**Localização:** Dashboard Administrativa → Monitor de Webhooks (GGCheckout)

**Informações Exibidas:**
- Data e hora do recebimento
- Origem (GGCHECKOUT)
- Tipo de evento
- Status (Processado/Pendente)
- Payload completo (JSON)
- Erros (se houver)

**Funcionalidades:**
- Botão "Atualizar" para recarregar logs
- Visualização do payload completo
- Indicação visual de sucesso/erro

### Gerenciamento de Usuários

**Localização:** Dashboard Administrativa → Gerenciamento de Usuários

**Funcionalidades:**
- Upload de arquivo CSV
- Pré-visualização dos dados
- Confirmação de importação
- Feedback detalhado do processo

---

## 🔍 Validações

### Webhook
- ✅ Email obrigatório
- ✅ Nome (fallback: "Novo Usuário")
- ✅ Telefone opcional (DDD + Número)
- ✅ Produto (fallback: "SermonIA PRO")

### CSV
- ✅ Cabeçalho obrigatório
- ✅ Colunas "Nome" e "Email" obrigatórias
- ✅ Linhas com dados incompletos são ignoradas
- ✅ Logs detalhados de cada linha processada

---

## 🚀 Fluxo Completo

```
GGCheckout → Webhook (/api/webhook/purchase)
                ↓
         Criar Log no DB
                ↓
      Extrair Dados (Nome, Email, Tel, Produto)
                ↓
         Validar Email
                ↓
    Buscar/Criar Usuário
                ↓
    Buscar/Criar Plano PRO
                ↓
   Criar Assinatura Vitalícia
                ↓
    Atualizar Log (Sucesso/Erro)
                ↓
         Retornar Resposta
```

---

## 📝 Notas Importantes

1. **Senha Temporária**: Usuários criados automaticamente recebem senha temporária e flag `needsPasswordSet: true`
2. **Duplicação**: Sistema verifica email antes de criar usuário (evita duplicação)
3. **Assinatura Única**: Verifica se usuário já tem assinatura ativa antes de criar nova
4. **Logs Completos**: Todos os eventos são registrados no banco de dados
5. **Plano Vitalício**: `nextBillingDate` é `null` para planos vitalícios

---

## 🎨 Interface do Admin

### Webhook Monitor
- Card com URL do webhook
- Instruções de configuração
- Tabela de logs em tempo real
- Botão de atualização manual

### Importação CSV
- Card com instruções detalhadas
- Formato esperado claramente descrito
- Pré-visualização em tabela
- Feedback visual do processo

---

## ✅ Checklist de Implementação

- [x] Webhook endpoint `/api/webhook/purchase`
- [x] Extração de dados da GGCheckout
- [x] Criação automática de usuários
- [x] Criação de plano SermonIA PRO
- [x] Criação de assinaturas vitalícias
- [x] Logs detalhados com emojis
- [x] Parser de CSV com formato GGCheckout
- [x] Validação de colunas obrigatórias
- [x] Pré-visualização de dados
- [x] Interface de admin atualizada
- [x] Documentação completa

---

**Data de Implementação:** 13/01/2026
**Versão:** 1.0
**Status:** ✅ Completo e Funcional
