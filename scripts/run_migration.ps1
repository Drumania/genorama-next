# Script de migración automatizada para Supabase (PowerShell)
# Este script ejecuta todos los pasos de migración en orden

Write-Host "🚀 Iniciando migración de usuarios y bandas en Supabase..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Función para mostrar mensajes de éxito
function Show-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

# Función para mostrar mensajes de error
function Show-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Función para mostrar mensajes de advertencia
function Show-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Show-Error "No estás en el directorio raíz del proyecto. Navega a la carpeta del proyecto primero."
    exit 1
}

Show-Success "Directorio del proyecto verificado"

# Verificar que los scripts SQL existen
if (-not (Test-Path "scripts/013_safe_migration.sql")) {
    Show-Error "Script de migración no encontrado: scripts/013_safe_migration.sql"
    exit 1
}

if (-not (Test-Path "scripts/012_migrate_profiles_data.sql")) {
    Show-Error "Script de migración de datos no encontrado: scripts/012_migrate_profiles_data.sql"
    exit 1
}

Show-Success "Scripts SQL encontrados"

Write-Host ""
Write-Host "📋 Pasos de migración:" -ForegroundColor Cyan
Write-Host "1. Crear nuevas tablas y políticas"
Write-Host "2. Migrar datos existentes"
Write-Host "3. Verificar la migración"
Write-Host ""

# Paso 1: Crear tablas
Write-Host "🔧 Paso 1: Creando nuevas tablas y políticas..." -ForegroundColor Yellow
Write-Host "Copia y pega el siguiente contenido en el SQL Editor de Supabase:" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Gray
Write-Host ""

Get-Content "scripts/013_safe_migration.sql" | Write-Host

Write-Host ""
Write-Host "==================================================" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "¿Has ejecutado el script en Supabase? (s/n)"
if ($response -notmatch "^[Ss]$") {
    Show-Warning "Migración cancelada. Ejecuta el script manualmente en Supabase."
    exit 1
}

Show-Success "Tablas creadas exitosamente"

# Paso 2: Migrar datos
Write-Host ""
Write-Host "📊 Paso 2: Migrando datos existentes..." -ForegroundColor Yellow
Write-Host "Copia y pega el siguiente contenido en el SQL Editor de Supabase:" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Gray
Write-Host ""

Get-Content "scripts/012_migrate_profiles_data.sql" | Write-Host

Write-Host ""
Write-Host "==================================================" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "¿Has ejecutado el script de migración de datos? (s/n)"
if ($response -notmatch "^[Ss]$") {
    Show-Warning "Migración de datos cancelada. Ejecuta el script manualmente en Supabase."
    exit 1
}

Show-Success "Datos migrados exitosamente"

# Paso 3: Verificación
Write-Host ""
Write-Host "🔍 Paso 3: Verificando la migración..." -ForegroundColor Yellow
Write-Host "Ejecuta las siguientes consultas en Supabase para verificar:" -ForegroundColor Cyan
Write-Host ""

Write-Host "Verificar usuarios migrados:" -ForegroundColor White
Write-Host "SELECT count(*) as total_users FROM users;" -ForegroundColor Gray
Write-Host "SELECT username, display_name FROM users LIMIT 5;" -ForegroundColor Gray
Write-Host ""

Write-Host "Verificar bandas migradas:" -ForegroundColor White
Write-Host "SELECT count(*) as total_bands FROM bands;" -ForegroundColor Gray
Write-Host "SELECT name, username FROM bands LIMIT 5;" -ForegroundColor Gray
Write-Host ""

Write-Host "Verificar relaciones usuario-banda:" -ForegroundColor White
Write-Host "SELECT count(*) as total_relationships FROM user_bands;" -ForegroundColor Gray
Write-Host "SELECT * FROM user_bands_view LIMIT 5;" -ForegroundColor Gray
Write-Host ""

# Paso 4: Probar la aplicación
Write-Host ""
Write-Host "🎯 Paso 4: Probando la aplicación..." -ForegroundColor Yellow
Write-Host "1. Recarga tu aplicación Next.js" -ForegroundColor White
Write-Host "2. Verifica que el login funcione correctamente" -ForegroundColor White
Write-Host "3. Ve a /usuario/[tu-username] para ver tu perfil" -ForegroundColor White
Write-Host "4. Verifica que no hay errores en la consola del navegador" -ForegroundColor White
Write-Host ""

Show-Success "¡Migración completada!"
Write-Host ""
Write-Host "📚 Recursos útiles:" -ForegroundColor Cyan
Write-Host "- README_USERS_BANDS.md - Documentación completa de la nueva estructura" -ForegroundColor White
Write-Host "- MIGRATION_INSTRUCTIONS.md - Instrucciones detalladas de migración" -ForegroundColor White
Write-Host "- scripts/014_cleanup_migration.sql - Script de limpieza si algo sale mal" -ForegroundColor White
Write-Host ""

Write-Host "🎉 ¡Tu base de datos ahora tiene usuarios y bandas separadas!" -ForegroundColor Green
Write-Host "Puedes continuar trabajando en el sistema de settings de usuario." -ForegroundColor White

# Mantener la ventana abierta en Windows
Read-Host "Presiona Enter para cerrar"
