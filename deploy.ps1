# EKYSrota 2027 Tek Komutla Canlıya Dağıtım Scripti
param(
    [string]$Message = "fix(update): guncel soru ve PWA iyilestirmeleri yayinlandi"
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  EKYSrota 2027 - Otomatik Canlıya Dağıtım (Deploy)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Git değişiklikleri kaydediliyor..." -ForegroundColor Yellow
git add -A
git commit -m "$Message"

Write-Host ""
Write-Host "[2/3] GitHub Reposuna gönderiliyor..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "[3/3] Firebase Hosting'e canlı yayın yapılıyor..." -ForegroundColor Yellow
npx -y firebase-tools deploy --only hosting

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  TEBRİKLER! Hem GitHub hem Firebase başarıyla güncellendi!" -ForegroundColor Green
Write-Host "  Canlı Adres: https://ekysrota.web.app/" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
