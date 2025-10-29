@echo off
echo ========================================
echo   ClientBase Backend - Instalacion
echo ========================================
echo.

echo [1/5] Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/5] Generando cliente de Prisma...
call npm run prisma:generate
if %ERRORLEVEL% NEQ 0 (
    echo Error al generar Prisma
    pause
    exit /b 1
)

echo.
echo [3/5] Ejecutando migraciones...
call npm run prisma:migrate
if %ERRORLEVEL% NEQ 0 (
    echo Error al ejecutar migraciones
    pause
    exit /b 1
)

echo.
echo [4/5] Cargando datos de ejemplo...
call npm run prisma:seed
if %ERRORLEVEL% NEQ 0 (
    echo Error al cargar datos
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Instalacion completada!
echo ========================================
echo.
echo Credenciales de acceso:
echo   Admin: admin@clientbase.com / admin123
echo   Usuario: user@clientbase.com / user123
echo.
echo Para iniciar el servidor ejecuta:
echo   npm run dev
echo.
pause

