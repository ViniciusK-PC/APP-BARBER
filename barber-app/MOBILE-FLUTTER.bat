@echo off
set FLUTTER=C:\flutter_windows_3.41.7-stable\flutter\bin\flutter.bat

echo ========================================
echo    BARBER APP - FLUTTER WEB
echo    https://web-nine-mu-18.vercel.app
echo ========================================
echo.
echo [1] Rodar localmente (browser)
echo [2] Atualizar deploy no Vercel
echo.
set /p opcao="Escolha (1 ou 2): "

if "%opcao%"=="1" goto local
if "%opcao%"=="2" goto deploy

:local
cd mobile-flutter
%FLUTTER% run -d chrome
pause
exit

:deploy
cd mobile-flutter
echo Gerando build...
%FLUTTER% build web --release
echo Fazendo deploy...
npx vercel build/web --prod --yes
echo.
echo App atualizado em: https://web-nine-mu-18.vercel.app
pause
exit
