@echo off
echo ==========================================
echo   CRIAR BANCO DE DADOS - BARBER APP
echo ==========================================
echo.

REM Encontrar PostgreSQL
set PSQL_PATH=
if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\18\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\17\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\17\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe

if "%PSQL_PATH%"=="" (
    echo ERRO: PostgreSQL nao encontrado!
    echo Instale em: https://www.postgresql.org/download/
    pause
    exit /b 1
)

echo Criando banco de dados 'barber_app'...
echo Digite a senha do PostgreSQL:
echo.

"%PSQL_PATH%" -U postgres -c "CREATE DATABASE barber_app;"

if errorlevel 1 (
    echo.
    echo ERRO! Verifique:
    echo - PostgreSQL esta rodando?
    echo - Senha correta?
    echo - Banco ja existe?
) else (
    echo.
    echo SUCESSO! Banco 'barber_app' criado!
    echo.
    echo Agora execute: START.bat
)

echo.
pause
