# Scripts de Base de Datos - Genorama

## Nueva Estructura: Usuarios y Bandas Separados

### Descripción del Cambio

Hemos separado la tabla `profiles` que mezclaba usuarios y bandas en dos entidades distintas:

1. **`users`** - Perfiles de usuarios individuales
2. **`bands`** - Perfiles de bandas/grupos musicales
3. **`user_bands`** - Tabla de relación muchos-a-muchos entre usuarios y bandas

### Ventajas de la Nueva Estructura

- ✅ **Separación clara**: Usuarios y bandas son entidades distintas
- ✅ **Relaciones flexibles**: Un usuario puede pertenecer a múltiples bandas con diferentes roles
- ✅ **Roles definidos**: owner, admin, member, collaborator
- ✅ **Escalabilidad**: Fácil agregar más bandas a un usuario o más usuarios a una banda
- ✅ **Mantenimiento**: Estructura más organizada y fácil de mantener

### Orden de Ejecución

1. **`009_create_users_and_bands.sql`** - Crea las nuevas tablas
2. **`010_migrate_profiles_to_users_bands.sql`** - Migra datos existentes
3. **`011_seed_users_and_bands.sql`** - Inserta datos de ejemplo (opcional)

### Ejecutar los Scripts

```bash
# 1. Crear las nuevas tablas
psql -h your-host -U your-user -d your-database -f scripts/009_create_users_and_bands.sql

# 2. Migrar datos existentes
psql -h your-host -U your-user -d your-database -f scripts/010_migrate_profiles_to_users_bands.sql

# 3. Insertar datos de ejemplo (opcional)
psql -h your-host -U your-user -d your-database -f scripts/011_seed_users_and_bands.sql
```

### Estructura de las Nuevas Tablas

#### Tabla `users`

```sql
- id (uuid, PK, referencia a auth.users)
- username (text, único)
- display_name (text)
- email (text)
- bio (text, nullable)
- avatar_url (text, nullable)
- website_url (text, nullable)
- location (text, nullable)
- created_at, updated_at
```

#### Tabla `bands`

```sql
- id (uuid, PK)
- name (text)
- username (text, único)
- description (text, nullable)
- cover_image_url, logo_url (text, nullable)
- website_url, spotify_url, youtube_url, instagram_url (text, nullable)
- location, city, country (text, nullable)
- genres (text[], nullable)
- founded_year (integer, nullable)
- is_active (boolean)
- created_at, updated_at
```

#### Tabla `user_bands`

```sql
- id (uuid, PK)
- user_id (uuid, FK a users)
- band_id (uuid, FK a bands)
- role (text: 'owner', 'member', 'admin', 'collaborator')
- joined_at (timestamp)
- is_active (boolean)
- unique(user_id, band_id)
```

### Roles de Usuario en Bandas

- **`owner`**: Propietario de la banda, puede eliminarla
- **`admin`**: Administrador, puede editar información de la banda
- **`member`**: Miembro activo de la banda
- **`collaborator`**: Colaborador ocasional

### Migración de Datos

El script de migración:

- Convierte perfiles con `is_band = false` a usuarios
- Convierte perfiles con `is_band = true` a bandas
- Crea relaciones usuario-banda para bandas existentes
- Actualiza referencias en otras tablas (releases, votes, donations, etc.)

### Compatibilidad

- ✅ Mantiene campos existentes para compatibilidad hacia atrás
- ✅ Agrega nuevos campos para la nueva estructura
- ✅ No rompe funcionalidad existente
- ✅ Permite migración gradual

### Próximos Pasos

1. Ejecutar los scripts en orden
2. Verificar que la migración fue exitosa
3. Actualizar el código de la aplicación para usar las nuevas tablas
4. Probar la funcionalidad con datos reales
5. Eventualmente eliminar campos obsoletos

### Notas Importantes

- **Backup**: Siempre hacer backup antes de ejecutar scripts de migración
- **Testing**: Probar en un entorno de desarrollo primero
- **Rollback**: Los scripts usan `IF NOT EXISTS` para evitar errores
- **Verificación**: Revisar los datos después de la migración
