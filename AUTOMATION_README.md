# 🤖 Automatización de Migración - Usuarios y Bandas

## 🚀 Scripts de Automatización Disponibles

Hemos creado varios scripts para automatizar el proceso de migración. Puedes usar el que prefieras según tu sistema operativo.

## 📱 **Opción 1: Script de Node.js (Recomendado)**

### **Ejecutar con npm:**

```bash
npm run migrate
```

### **Ejecutar directamente:**

```bash
node scripts/run_migration.js
```

### **Ventajas:**

- ✅ Funciona en cualquier sistema operativo
- ✅ Colores en la terminal
- ✅ Interactivo con confirmaciones
- ✅ Muestra los scripts SQL automáticamente
- ✅ Guía paso a paso

## 🐧 **Opción 2: Script de Bash (macOS/Linux)**

### **Ejecutar con npm:**

```bash
npm run migrate:bash
```

### **Ejecutar directamente:**

```bash
./scripts/run_migration.sh
```

### **Ventajas:**

- ✅ Nativo en macOS/Linux
- ✅ Colores en la terminal
- ✅ Interactivo con confirmaciones

## 🪟 **Opción 3: Script de PowerShell (Windows)**

### **Ejecutar directamente:**

```powershell
.\scripts\run_migration.ps1
```

### **Ventajas:**

- ✅ Nativo en Windows
- ✅ Colores en la terminal
- ✅ Interactivo con confirmaciones

## 🔧 **Scripts NPM Disponibles**

```json
{
  "scripts": {
    "migrate": "node scripts/run_migration.js", // Script principal
    "migrate:bash": "./scripts/run_migration.sh", // Script bash
    "migrate:cleanup": "echo 'Ejecuta en Supabase...'" // Instrucciones de limpieza
  }
}
```

## 📋 **¿Qué Hace la Automatización?**

### **1. Verificación del Entorno**

- ✅ Confirma que estás en el directorio correcto
- ✅ Verifica que los scripts SQL existen
- ✅ Valida la estructura del proyecto

### **2. Guía Paso a Paso**

- 🔧 **Paso 1**: Muestra el script de creación de tablas
- 📊 **Paso 2**: Muestra el script de migración de datos
- 🔍 **Paso 3**: Proporciona consultas de verificación
- 🎯 **Paso 4**: Instrucciones para probar la aplicación

### **3. Confirmaciones Interactivas**

- Pregunta si ejecutaste cada script en Supabase
- Permite cancelar en cualquier momento
- Guía hacia el siguiente paso

### **4. Recursos y Referencias**

- Muestra dónde encontrar documentación
- Proporciona comandos de verificación
- Enlaza a scripts de limpieza si es necesario

## 🎯 **Flujo de Migración Automatizado**

```
🚀 Inicio
   ↓
✅ Verificar entorno
   ↓
🔧 Paso 1: Crear tablas
   ↓ (confirmación del usuario)
📊 Paso 2: Migrar datos
   ↓ (confirmación del usuario)
🔍 Paso 3: Verificación
   ↓
🎯 Paso 4: Pruebas
   ↓
🎉 Migración completada
```

## 🚨 **En Caso de Problemas**

### **Script de Limpieza:**

```bash
npm run migrate:cleanup
```

### **Limpieza Manual:**

1. Ve al SQL Editor de Supabase
2. Ejecuta `scripts/014_cleanup_migration.sql`
3. Vuelve a ejecutar la migración

## 🔍 **Verificación Automatizada**

Los scripts proporcionan automáticamente las consultas SQL para verificar:

```sql
-- Verificar usuarios migrados
SELECT count(*) as total_users FROM users;
SELECT username, display_name FROM users LIMIT 5;

-- Verificar bandas migradas
SELECT count(*) as total_bands FROM bands;
SELECT name, username FROM bands LIMIT 5;

-- Verificar relaciones usuario-banda
SELECT count(*) as total_relationships FROM user_bands;
SELECT * FROM user_bands_view LIMIT 5;
```

## 📚 **Recursos Incluidos**

- **`scripts/run_migration.js`** - Script principal de Node.js
- **`scripts/run_migration.sh`** - Script de Bash para macOS/Linux
- **`scripts/run_migration.ps1`** - Script de PowerShell para Windows
- **`scripts/013_safe_migration.sql`** - Creación de tablas (sin conflictos)
- **`scripts/012_migrate_profiles_data.sql`** - Migración de datos
- **`scripts/014_cleanup_migration.sql`** - Limpieza en caso de problemas

## 🎉 **Beneficios de la Automatización**

1. **🚀 Velocidad**: No más copiar y pegar manual
2. **🛡️ Seguridad**: Verificaciones automáticas del entorno
3. **📱 Multiplataforma**: Funciona en Windows, macOS y Linux
4. **🎨 Interactivo**: Confirmaciones paso a paso
5. **📚 Documentado**: Incluye recursos y referencias
6. **🔄 Reversible**: Scripts de limpieza incluidos

## 🚀 **¡Empezar es Fácil!**

```bash
# Solo ejecuta este comando:
npm run migrate

# Y sigue las instrucciones en pantalla
```

¡La migración nunca fue tan fácil! 🎉
