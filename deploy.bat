@echo off
chcp 65001 >nul
echo ========================================================
echo   EKYSrota 2027 - Otomatik Canlıya Dağıtım (Deploy)
echo ========================================================
echo.

set MSG=%~1
if "%MSG%"=="" set MSG=Guncelleme: soru ve arayuz iyilestirmeleri

echo [1/3] Git degisiklikleri kaydediliyor...
git add -A
git commit -m "%MSG%"

echo.
echo [2/3] GitHub Reposuna gonderiliyor...
git push origin main

echo.
echo [3/3] Firebase Hosting'e canli yayin yapiliyor...
call npx -y firebase-tools deploy --only hosting

echo.
echo ========================================================
echo   TEBRIKLER! Hem GitHub hem Firebase basariyla guncellendi!
echo   Canli Adres: https://ekysrota.web.app/
echo ========================================================
