# Script DIRETO para criar os 4 planos no banco

Write-Host "🚀 Criando os 4 planos no PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

$body = @{
    action = "seed"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/seed-plans" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ SUCESSO! Planos criados:" -ForegroundColor Green
    Write-Host ""
    
    if ($data.plans) {
        foreach ($plan in $data.plans) {
            Write-Host "  ✓ $($plan.name)" -ForegroundColor White
            Write-Host "    Preço: R$ $($plan.price)" -ForegroundColor Gray
            Write-Host "    Intervalo: $($plan.interval)" -ForegroundColor Gray
            Write-Host ""
        }
    }
    
    Write-Host "Total: $($data.plans.Count) planos criados" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Agora você pode adicionar usuários com planos!" -ForegroundColor Green
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 200) {
        Write-Host "✅ Planos já existem no banco!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Para ver os planos, acesse:" -ForegroundColor Cyan
        Write-Host "  http://localhost:3000/api/seed-plans" -ForegroundColor White
    } else {
        Write-Host "❌ Erro ao criar planos" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        
        Write-Host ""
        Write-Host "Tente acessar manualmente:" -ForegroundColor Yellow
        Write-Host "  http://localhost:3000/api/seed-plans" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
