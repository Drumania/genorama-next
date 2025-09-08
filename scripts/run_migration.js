#!/usr/bin/env node

// Script de migración automatizada para Supabase (Node.js)
// Este script ejecuta todos los pasos de migración en orden

const fs = require("fs");
const path = require("path");

// Colores para output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Función para mostrar mensajes de éxito
function showSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

// Función para mostrar mensajes de error
function showError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

// Función para mostrar mensajes de advertencia
function showWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

// Función para mostrar mensajes informativos
function showInfo(message) {
  console.log(`${colors.cyan}ℹ️  ${message}${colors.reset}`);
}

// Función para mostrar títulos
function showTitle(message) {
  console.log(`${colors.blue}${message}${colors.reset}`);
}

// Función para leer input del usuario
function readInput(prompt) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Función principal
async function main() {
  console.log(
    `${colors.green}🚀 Iniciando migración de usuarios y bandas en Supabase...${colors.reset}`
  );
  console.log("==================================================");

  // Verificar que estamos en el directorio correcto
  if (!fs.existsSync("package.json")) {
    showError(
      "No estás en el directorio raíz del proyecto. Navega a la carpeta del proyecto primero."
    );
    process.exit(1);
  }

  showSuccess("Directorio del proyecto verificado");

  // Verificar que los scripts SQL existen
  if (!fs.existsSync("scripts/013_safe_migration.sql")) {
    showError(
      "Script de migración no encontrado: scripts/013_safe_migration.sql"
    );
    process.exit(1);
  }

  if (!fs.existsSync("scripts/012_migrate_profiles_data.sql")) {
    showError(
      "Script de migración de datos no encontrado: scripts/012_migrate_profiles_data.sql"
    );
    process.exit(1);
  }

  showSuccess("Scripts SQL encontrados");

  console.log("");
  showTitle("📋 Pasos de migración:");
  console.log("1. Crear nuevas tablas y políticas");
  console.log("2. Migrar datos existentes");
  console.log("3. Verificar la migración");
  console.log("");

  // Paso 1: Crear tablas
  showTitle("🔧 Paso 1: Creando nuevas tablas y políticas...");
  console.log(
    "Copia y pega el siguiente contenido en el SQL Editor de Supabase:"
  );
  console.log("==================================================");
  console.log("");

  const migrationScript = fs.readFileSync(
    "scripts/013_safe_migration.sql",
    "utf8"
  );
  console.log(migrationScript);

  console.log("");
  console.log("==================================================");
  console.log("");

  const response1 = await readInput(
    "¿Has ejecutado el script en Supabase? (s/n): "
  );
  if (!response1.toLowerCase().startsWith("s")) {
    showWarning(
      "Migración cancelada. Ejecuta el script manualmente en Supabase."
    );
    process.exit(1);
  }

  showSuccess("Tablas creadas exitosamente");

  // Paso 2: Migrar datos
  console.log("");
  showTitle("📊 Paso 2: Migrando datos existentes...");
  console.log(
    "Copia y pega el siguiente contenido en el SQL Editor de Supabase:"
  );
  console.log("==================================================");
  console.log("");

  const dataMigrationScript = fs.readFileSync(
    "scripts/012_migrate_profiles_data.sql",
    "utf8"
  );
  console.log(dataMigrationScript);

  console.log("");
  console.log("==================================================");
  console.log("");

  const response2 = await readInput(
    "¿Has ejecutado el script de migración de datos? (s/n): "
  );
  if (!response2.toLowerCase().startsWith("s")) {
    showWarning(
      "Migración de datos cancelada. Ejecuta el script manualmente en Supabase."
    );
    process.exit(1);
  }

  showSuccess("Datos migrados exitosamente");

  // Paso 3: Verificación
  console.log("");
  showTitle("🔍 Paso 3: Verificando la migración...");
  console.log("Ejecuta las siguientes consultas en Supabase para verificar:");
  console.log("");

  console.log("Verificar usuarios migrados:");
  console.log("SELECT count(*) as total_users FROM users;");
  console.log("SELECT username, display_name FROM users LIMIT 5;");
  console.log("");

  console.log("Verificar bandas migradas:");
  console.log("SELECT count(*) as total_bands FROM bands;");
  console.log("SELECT name, username FROM bands LIMIT 5;");
  console.log("");

  console.log("Verificar relaciones usuario-banda:");
  console.log("SELECT count(*) as total_relationships FROM user_bands;");
  console.log("SELECT * FROM user_bands_view LIMIT 5;");
  console.log("");

  // Paso 4: Probar la aplicación
  console.log("");
  showTitle("🎯 Paso 4: Probando la aplicación...");
  console.log("1. Recarga tu aplicación Next.js");
  console.log("2. Verifica que el login funcione correctamente");
  console.log("3. Ve a /usuario/[tu-username] para ver tu perfil");
  console.log("4. Verifica que no hay errores en la consola del navegador");
  console.log("");

  showSuccess("¡Migración completada!");
  console.log("");
  showTitle("📚 Recursos útiles:");
  console.log(
    "- README_USERS_BANDS.md - Documentación completa de la nueva estructura"
  );
  console.log(
    "- MIGRATION_INSTRUCTIONS.md - Instrucciones detalladas de migración"
  );
  console.log(
    "- scripts/014_cleanup_migration.sql - Script de limpieza si algo sale mal"
  );
  console.log("");

  console.log(
    `${colors.green}🎉 ¡Tu base de datos ahora tiene usuarios y bandas separadas!${colors.reset}`
  );
  console.log(
    "Puedes continuar trabajando en el sistema de settings de usuario."
  );
}

// Ejecutar el script
if (require.main === module) {
  main().catch(console.error);
}
