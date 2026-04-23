@echo off
chcp 65001 >nul
echo ========================================
echo    📱 BARBER APP - GERAR APK
echo ========================================
echo.

cd mobile

echo ⚠️  ATENÇÃO: Você precisa ter os ícones criados!
echo.
echo Verifique se existem:
echo   - assets/icon.png (1024x1024 px)
echo   - assets/adaptive-icon.png (1024x1024 px)
echo.
echo Se NÃO tiver, pressione CTRL+C e crie primeiro!
echo Se JÁ tiver, pressione qualquer tecla para continuar...
pause >nul

echo.
echo ========================================
echo    PASSO 1: Verificando EAS CLI
echo ========================================
call eas --version 2>nul
if errorlevel 1 (
    echo ❌ EAS CLI não encontrado!
    echo 📦 Instalando EAS CLI...
    call npm install -g eas-cli
    echo ✅ EAS CLI instalado!
)

echo.
echo ========================================
echo    PASSO 2: Login no Expo
echo ========================================
echo.
echo 👤 Faça login com sua conta Expo
echo    (Se não tiver, crie em: https://expo.dev)
echo.
call eas login

echo.
echo ========================================
echo    PASSO 3: Configurar Projeto
echo ========================================
call eas build:configure

echo.
echo ========================================
echo    PASSO 4: Gerar APK
echo ========================================
echo.
echo ⏳ Isso pode levar 10-15 minutos...
echo 📊 Acompanhe em: https://expo.dev
echo.
call eas build --platform android --profile preview

echo.
echo ========================================
echo    ✅ BUILD CONCLUÍDO!
echo ========================================
echo.
echo 📱 Baixe o APK no link fornecido acima
echo 📲 Instale no seu celular Android
echo.
echo 👤 Login Admin: admin@barber.com / admin123
echo 👤 Login Cliente: cliente@teste.com / cliente123
echo.
pause
