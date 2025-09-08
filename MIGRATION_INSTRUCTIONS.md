# 🚀 Instrucciones de Migración - Usuarios y Bandas

## ⚠️ IMPORTANTE: Leer antes de ejecutar

Este documento explica cómo migrar tu base de datos de Supabase de la estructura actual a la nueva estructura de usuarios y bandas separadas.

## 📋 Pasos de Migración

### **Paso 1: Acceder al Dashboard de Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **genorama**
4. Ve a **SQL Editor** en el menú lateral izquierdo

### **Paso 2: Ejecutar el Script de Creación de Tablas**

1. En el SQL Editor, crea un nuevo query
2. Copia y pega todo el contenido del archivo `scripts/013_safe_migration.sql`
3. Haz clic en **RUN** para ejecutar el script
4. Verifica que no haya errores en la consola

**Este script creará:**

- ✅ Tabla `users` (personas)
- ✅ Tabla `bands` (bandas musicales)
- ✅ Tabla `user_bands` (relación usuario-banda)
- ✅ Tabla `band_followers` (seguidores)
- ✅ Tabla `user_activity` (actividad del usuario)
- ✅ Tabla `user_preferences` (preferencias)
- ✅ Políticas de seguridad (RLS) - **maneja conflictos existentes**
- ✅ Índices para optimización

### **Paso 3: Ejecutar el Script de Migración de Datos**

1. Crea otro nuevo query en el SQL Editor
2. Copia y pega todo el contenido del archivo `scripts/012_migrate_profiles_data.sql`
3. Haz clic en **RUN** para ejecutar el script
4. Al final verás un resumen de la migración

**Este script migrará:**

- ✅ Usuarios existentes de `profiles` a `users`
- ✅ Bandas existentes de `profiles` a `bands`
- ✅ Creará relaciones usuario-banda
- ✅ Creará preferencias por defecto
- ✅ Creará vistas útiles para consultas

### **Paso 4: Verificar la Migración**

1. Ve a **Table Editor** en el menú lateral
2. Verifica que existan las nuevas tablas:

   - `users`
   - `bands`
   - `user_bands`
   - `band_followers`
   - `user_activity`
   - `user_preferences`

3. Verifica que existan las vistas:
   - `user_bands_view`
   - `user_bands_summary`
   - `user_stats`

### **Paso 5: En Caso de Problemas (Opcional)**

Si encuentras errores persistentes y quieres empezar desde cero:

1. En el SQL Editor, crea un nuevo query
2. Copia y pega todo el contenido del archivo `scripts/014_cleanup_migration.sql`
3. Haz clic en **RUN** para limpiar todas las tablas de migración
4. Vuelve al **Paso 2** para ejecutar la migración nuevamente

## 🔍 Verificación de Datos

### **Verificar Usuarios Migrados**

```sql
select count(*) as total_users from users;
select username, display_name from users limit 5;
```

### **Verificar Bandas Migradas**

```sql
select count(*) as total_bands from bands;
select name, username from bands limit 5;
```

### **Verificar Relaciones Usuario-Banda**

```sql
select count(*) as total_relationships from user_bands;
select * from user_bands_view limit 5;
```

## 🚨 Solución de Problemas

### **Error: "relation does not exist"**

- Asegúrate de haber ejecutado `013_safe_migration.sql` primero
- Verifica que estés en el proyecto correcto de Supabase

### **Error: "duplicate key value violates unique constraint"**

- Normal, significa que algunos datos ya existen
- El script usa `on conflict do nothing` para evitar duplicados

### **Error: "permission denied"**

- Verifica que tengas permisos de administrador en el proyecto
- Las políticas RLS pueden estar bloqueando el acceso

### **Error: "policy already exists"**

- Usa el script `013_safe_migration.sql` que maneja políticas existentes
- Si persiste, usa `014_cleanup_migration.sql` para limpiar y empezar de nuevo

## 🎯 Después de la Migración

### **1. Probar la Aplicación**

- Recarga tu aplicación Next.js
- Verifica que el login funcione correctamente
- Verifica que el header muestre la información del usuario

### **2. Probar las Nuevas Funcionalidades**

- Ve a `/usuario/[tu-username]` para ver tu perfil
- Verifica que se muestren tus bandas correctamente
- Prueba crear una nueva banda

### **3. Verificar la Consola del Navegador**

- No deberían aparecer errores 404 o 406
- Las consultas a las nuevas tablas deberían funcionar

## 📱 Estructura Final

Después de la migración tendrás:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     users       │    │     bands       │    │   user_bands    │
│  (personas)     │◄──►│  (bandas)       │◄──►│  (relación)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│user_preferences │    │band_followers   │    │ user_activity   │
│(preferencias)   │    │(seguidores)     │    │ (actividad)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas durante la migración:

1. **Verifica los logs** en la consola de Supabase
2. **Revisa los permisos** de tu usuario en el proyecto
3. **Ejecuta los scripts paso a paso** para identificar dónde falla
4. **Contacta al equipo** con el error específico

## ✅ Checklist de Migración

- [ ] Ejecutar `011_simple_migration.sql` ✅
- [ ] Ejecutar `012_migrate_profiles_data.sql` ✅
- [ ] Verificar que existan las nuevas tablas ✅
- [ ] Verificar que existan las vistas ✅
- [ ] Probar la aplicación ✅
- [ ] Verificar que no hay errores en consola ✅

¡La migración está lista para comenzar! 🎉
