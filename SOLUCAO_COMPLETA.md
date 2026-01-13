# 🚨 SOLUÇÃO PARA AMBOS OS PROBLEMAS

## ❌ **PROBLEMA 1: Erro ao Salvar Sermão**
**Erro:** `Argument content is missing`

## ❌ **PROBLEMA 2: Impressão Mostra Apenas 1 Página**
**Problema:** Preview mostra tudo, mas impressão só mostra 1 folha

---

## ✅ **SOLUÇÃO IMEDIATA:**

### **PASSO 1: PARE O SERVIDOR**
No terminal onde está `npm run dev`, pressione:
```
Ctrl + C
```

### **PASSO 2: EXECUTE O SCRIPT DE LIMPEZA**
```powershell
.\limpar-cache.ps1
```

**OU manualmente:**
```powershell
# Limpa .next
Remove-Item -Recurse -Force .next

# Limpa cache
Remove-Item -Recurse -Force node_modules\.cache

# Regenera Prisma
npx prisma generate
```

### **PASSO 3: REINICIE O SERVIDOR**
```powershell
npm run dev
```

### **PASSO 4: TESTE SALVAR**
1. Abra o navegador
2. Pressione **Ctrl + Shift + R** (hard reload)
3. Tente salvar o sermão novamente

---

## 🖨️ **SOLUÇÃO PARA IMPRESSÃO (MÚLTIPLAS PÁGINAS):**

O problema é que o CSS @print precisa de regras mais específicas.

### **Arquivo a Atualizar:** `src/app/globals.css`

Procure a seção `@media print` e **SUBSTITUA COMPLETAMENTE** por:

```css
/* Print Styles - Múltiplas Páginas A4 */
@media print {
  @page {
    size: A4 portrait;
    margin: 20mm 15mm;
  }

  /* Oculta tudo exceto área de impressão */
  body * {
    visibility: hidden !important;
  }

  #print-area,
  #print-area * {
    visibility: visible !important;
  }

  /* Posiciona área de impressão */
  #print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    box-shadow: none !important;
  }

  /* Remove altura mínima */
  body, html, #print-area {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }

  /* Permite quebra de página */
  section {
    page-break-inside: avoid !important;
  }

  /* Backgrounds apenas para texto */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Remove backgrounds decorativos */
  .bg-gradient-to-r,
  .bg-gradient-to-br,
  .bg-indigo-50,
  .bg-blue-50,
  .bg-purple-50,
  .bg-amber-50 {
    background: white !important;
  }

  /* Mantém bordas importantes */
  .border-l-4 {
    border-left-width: 4px !important;
  }
}
```

---

## 📋 **CHECKLIST FINAL:**

### **Para Salvar Sermão:**
- [ ] Parou o servidor (Ctrl+C)
- [ ] Limpou .next
- [ ] Limpou node_modules/.cache
- [ ] Regenerou Prisma (npx prisma generate)
- [ ] Reiniciou servidor (npm run dev)
- [ ] Hard reload no navegador (Ctrl+Shift+R)
- [ ] Testou salvar → ✅ Funciona!

### **Para Impressão:**
- [ ] Atualizou globals.css com novo @media print
- [ ] Salvou o arquivo
- [ ] Reiniciou servidor
- [ ] Testou impressão → ✅ Múltiplas páginas!

---

## 🎯 **TESTE DE IMPRESSÃO:**

**1. Preencha sermão longo:**
- Título
- Introdução (3 parágrafos)
- 4 Pontos (cada com 2-3 parágrafos)
- Aplicações (4 áreas)
- Conclusão

**2. Clique "Visualizar/Imprimir"**

**3. Clique "Imprimir Agora"**

**4. No preview do Windows:**
- ✅ Deve mostrar "Página 1 de X"
- ✅ Use setas para ver todas as páginas
- ✅ Conteúdo distribuído corretamente

---

## ⚡ **SE AINDA NÃO FUNCIONAR:**

**Teste direto no navegador:**

1. Abra o Preview de impressão
2. Pressione **F12** (DevTools)
3. Console → Digite:
```javascript
document.querySelectorAll('section').forEach(s => {
  s.style.pageBreakInside = 'avoid';
  s.style.pageBreakAfter = 'auto';
});
```
4. Tente imprimir novamente

---

## 🆘 **SOLUÇÃO ALTERNATIVA (SE PERSISTIR):**

**Criar PDF via navegador:**
1. Ctrl+P (Imprimir)
2. Destino: **"Salvar como PDF"**
3. Margens: **Padrão**
4. Opções → ✅ **"Gráficos de fundo"**
5. Salvar

O PDF terá todas as páginas corretas!

---

## 📞 **AINDA COM PROBLEMA?**

Execute e me envie o resultado:

```powershell
# Verifica versão do Next.js
npm list next

# Verifica se .next existe
Test-Path .next

# Verifica última modificação de globals.css
(Get-Item src\app\globals.css).LastWriteTime
```

---

**SIGA OS PASSOS ACIMA NA ORDEM!** ✅
