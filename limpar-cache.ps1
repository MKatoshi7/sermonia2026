# Script para Limpar Cache Completo e Resolver Erros

Write-Host "🧹 Limpando cache completo do Next.js..." -ForegroundColor Cyan

# Para o servidor se estiver rodando
Write-Host "Parando servidor (se estiver rodando)..." -ForegroundColor Yellow

# Limpa .next
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Pasta .next removida" -ForegroundColor Green
}

# Limpa node_modules/.cache
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✅ Cache do node_modules removido" -ForegroundColor Green
}

# Regenera Prisma Client
Write-Host "" -ForegroundColor White
Write-Host "🔄 Regenerando Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "" -ForegroundColor White
Write-Host "✅ Cache limpo e Prisma regenerado!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📌 PRÓXIMO PASSO:" -ForegroundColor Yellow
Write-Host "   Execute: npm run dev" -ForegroundColor White
Write-Host "" -ForegroundColor White
