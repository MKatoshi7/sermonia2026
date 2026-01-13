# Script para Popular os 4 Planos no Banco de Dados

Write-Host "🚀 Criando os 4 planos no banco de dados..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/seed-plans" -Method POST -ContentType "application/json"
    
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Planos criados:" -ForegroundColor Yellow
    
    foreach ($plan in $response.plans) {
        Write-Host "  - $($plan.name) - R$ $($plan.price) - $($plan.interval)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Total de planos: $($response.plans.Count)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro ao criar planos:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
