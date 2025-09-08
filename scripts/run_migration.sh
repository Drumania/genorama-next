#!/bin/bash

# Script de migración automatizada para Supabase
# Este script ejecuta todos los pasos de migración en orden

echo "🚀 Iniciando migración de usuarios y bandas en Supabase..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes de éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar mensajes de error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para mostrar mensajes de advertencia
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No estás en el directorio raíz del proyecto. Navega a la carpeta del proyecto primero."
    exit 1
fi

success "Directorio del proyecto verificado"

# Verificar que los scripts SQL existen
if [ ! -f "scripts/013_safe_migration.sql" ]; then
    error "Script de migración no encontrado: scripts/013_safe_migration.sql"
    exit 1
fi

if [ ! -f "scripts/012_migrate_profiles_data.sql" ]; then
    error "Script de migración de datos no encontrado: scripts/012_migrate_profiles_data.sql"
    exit 1
fi

success "Scripts SQL encontrados"

echo ""
echo "📋 Pasos de migración:"
echo "1. Crear nuevas tablas y políticas"
echo "2. Migrar datos existentes"
echo "3. Verificar la migración"
echo ""

# Paso 1: Crear tablas
echo "🔧 Paso 1: Creando nuevas tablas y políticas..."
echo "Copia y pega el siguiente contenido en el SQL Editor de Supabase:"
echo "=================================================="
echo ""
cat scripts/013_safe_migration.sql
echo ""
echo "=================================================="
echo ""

read -p "¿Has ejecutado el script en Supabase? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    warning "Migración cancelada. Ejecuta el script manualmente en Supabase."
    exit 1
fi

success "Tablas creadas exitosamente"

# Paso 2: Migrar datos
echo ""
echo "📊 Paso 2: Migrando datos existentes..."
echo "Copia y pega el siguiente contenido en el SQL Editor de Supabase:"
echo "=================================================="
echo ""
cat scripts/012_migrate_profiles_data.sql
echo ""
echo "=================================================="
echo ""

read -p "¿Has ejecutado el script de migración de datos? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    warning "Migración de datos cancelada. Ejecuta el script manualmente en Supabase."
    exit 1
fi

success "Datos migrados exitosamente"

# Paso 3: Verificación
echo ""
echo "🔍 Paso 3: Verificando la migración..."
echo "Ejecuta las siguientes consultas en Supabase para verificar:"
echo ""

echo "Verificar usuarios migrados:"
echo "SELECT count(*) as total_users FROM users;"
echo "SELECT username, display_name FROM users LIMIT 5;"
echo ""

echo "Verificar bandas migradas:"
echo "SELECT count(*) as total_bands FROM bands;"
echo "SELECT name, username FROM bands LIMIT 5;"
echo ""

echo "Verificar relaciones usuario-banda:"
echo "SELECT count(*) as total_relationships FROM user_bands;"
echo "SELECT * FROM user_bands_view LIMIT 5;"
echo ""

# Paso 4: Probar la aplicación
echo ""
echo "🎯 Paso 4: Probando la aplicación..."
echo "1. Recarga tu aplicación Next.js"
echo "2. Verifica que el login funcione correctamente"
echo "3. Ve a /usuario/[tu-username] para ver tu perfil"
echo "4. Verifica que no hay errores en la consola del navegador"
echo ""

success "¡Migración completada!"
echo ""
echo "📚 Recursos útiles:"
echo "- README_USERS_BANDS.md - Documentación completa de la nueva estructura"
echo "- MIGRATION_INSTRUCTIONS.md - Instrucciones detalladas de migración"
echo "- scripts/014_cleanup_migration.sql - Script de limpieza si algo sale mal"
echo ""

echo "🎉 ¡Tu base de datos ahora tiene usuarios y bandas separadas!"
echo "Puedes continuar trabajando en el sistema de settings de usuario."
