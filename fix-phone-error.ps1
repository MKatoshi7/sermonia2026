# Script para corrigir o problema do campo 'phone'
# Este script limpa o cache do Next.js e regenera o Prisma Client

Write-Host "🔧 Corrigindo problema do campo 'phone'..." -ForegroundColor Cyan
Write-Host ""

# 1. Para o servidor (se estiver rodando)
Write-Host "1. Por favor, PARE o servidor Next.js (Ctrl+C no terminal)" -ForegroundColor Yellow
Write-Host "   Pressione ENTER quando tiver parado o servidor..." -ForegroundColor Yellow
$null = Read-Host

# 2. Remove cache do Next.js
Write-Host ""
Write-Host "2. Removendo cache do Next.js..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✅ Cache .next removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Pasta .next não existe" -ForegroundColor Gray
}

# 3. Remove node_modules/.prisma
Write-Host ""
Write-Host "3. Removendo Prisma Client antigo..." -ForegroundColor Cyan
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
    Write-Host "   ✅ Prisma Client antigo removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Pasta .prisma não existe" -ForegroundColor Gray
}

# 4. Regenera Prisma Client
Write-Host ""
Write-Host "4. Regenerando Prisma Client..." -ForegroundColor Cyan
npx prisma generate
Write-Host "   ✅ Prisma Client regenerado" -ForegroundColor Green

# 5. Instrui a reiniciar
Write-Host ""
Write-Host "✅ TUDO PRONTO!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "O erro do campo 'phone' será corrigido!" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
