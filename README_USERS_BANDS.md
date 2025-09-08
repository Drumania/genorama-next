# Nueva Estructura de Usuarios y Bandas en Genorama

## Resumen de Cambios

Hemos reestructurado la base de datos para separar claramente los **usuarios (personas)** de las **bandas**, permitiendo que un usuario pueda tener múltiples bandas.

## Estructura de Base de Datos

### 1. Tabla `users` (Personas)

- **id**: UUID (referencia a auth.users)
- **username**: Nombre de usuario único
- **display_name**: Nombre para mostrar
- **email**: Email del usuario
- **bio**: Biografía personal
- **avatar_url**: URL del avatar
- **website_url**: Sitio web personal
- **location**: Ubicación
- **date_of_birth**: Fecha de nacimiento
- **created_at**: Fecha de creación
- **updated_at**: Fecha de actualización

### 2. Tabla `bands` (Bandas)

- **id**: UUID único
- **name**: Nombre de la banda
- **username**: Username único de la banda
- **description**: Descripción de la banda
- **avatar_url**: Logo de la banda
- **cover_image_url**: Imagen de portada
- **website_url**: Sitio web oficial
- **spotify_url**: Enlace a Spotify
- **youtube_url**: Enlace a YouTube
- **instagram_url**: Enlace a Instagram
- **location**: Ubicación de la banda
- **genres**: Array de géneros musicales
- **founded_date**: Fecha de fundación
- **is_active**: Si la banda está activa
- **created_at**: Fecha de creación
- **updated_at**: Fecha de actualización

### 3. Tabla `user_bands` (Relación Usuario-Banda)

- **id**: UUID único
- **user_id**: Referencia al usuario
- **band_id**: Referencia a la banda
- **role**: Rol del usuario ('owner', 'admin', 'member')
- **joined_date**: Fecha de unión
- **is_active**: Si la relación está activa
- **created_at**: Fecha de creación

### 4. Tabla `band_followers` (Seguidores)

- **id**: UUID único
- **user_id**: Usuario que sigue
- **band_id**: Banda seguida
- **created_at**: Fecha de seguimiento

### 5. Tabla `user_activity` (Actividad del Usuario)

- **id**: UUID único
- **user_id**: Usuario
- **activity_type**: Tipo de actividad
- **target_id**: ID del elemento relacionado
- **target_type**: Tipo del elemento
- **metadata**: Datos adicionales (JSON)
- **created_at**: Fecha de la actividad

### 6. Tabla `user_preferences` (Preferencias)

- **id**: UUID único
- **user_id**: Usuario
- **email_notifications**: Notificaciones por email
- **push_notifications**: Notificaciones push
- **privacy_level**: Nivel de privacidad
- **created_at**: Fecha de creación
- **updated_at**: Fecha de actualización

## Casos de Uso

### Ejemplo: Usuario Martín

- **Usuario**: Martín (persona)
- **Bandas**:
  - Red Cash (rol: owner)
  - The Summernight (rol: member)

### Flujo de Creación

1. Usuario se registra → Se crea en tabla `users`
2. Usuario crea banda → Se crea en tabla `bands`
3. Se crea relación en `user_bands` con rol 'owner'

## Archivos Creados/Modificados

### Nuevos Archivos

- `scripts/009_restructure_users_bands.sql` - Estructura de base de datos
- `scripts/010_migrate_existing_data.sql` - Migración de datos existentes
- `components/user-profile.tsx` - Componente de perfil de usuario
- `app/usuario/[username]/page.tsx` - Página de perfil de usuario
- `README_USERS_BANDS.md` - Este archivo

### Archivos Modificados

- `lib/types.ts` - Nuevos tipos TypeScript
- `lib/supabase/queries.ts` - Nuevas funciones de consulta
- `components/header.tsx` - Lógica actualizada para usuarios/bandas

## Migración

### Pasos para Aplicar

1. Ejecutar `009_restructure_users_bands.sql` para crear la nueva estructura
2. Ejecutar `010_migrate_existing_data.sql` para migrar datos existentes
3. Actualizar la aplicación para usar las nuevas tablas

### Notas de Migración

- Los perfiles existentes se migrarán automáticamente
- Los perfiles con `is_band = true` se convertirán en bandas
- Los perfiles con `is_band = false` o `null` se convertirán en usuarios
- Se mantendrán las relaciones existentes

## Beneficios de la Nueva Estructura

1. **Separación Clara**: Usuarios y bandas son entidades distintas
2. **Múltiples Bandas**: Un usuario puede pertenecer a varias bandas
3. **Roles Flexibles**: Diferentes niveles de acceso en cada banda
4. **Actividad Personal**: Seguimiento de actividad individual del usuario
5. **Preferencias**: Configuración personalizada por usuario
6. **Escalabilidad**: Estructura preparada para crecimiento futuro

## Próximos Pasos

1. **Implementar Settings de Usuario**: Página de configuración personal
2. **Gestión de Bandas**: Crear, editar y administrar bandas
3. **Sistema de Invitaciones**: Invitar usuarios a bandas
4. **Notificaciones**: Sistema de notificaciones personalizado
5. **Dashboard de Usuario**: Vista general de actividad y bandas

## Consideraciones Técnicas

- **RLS (Row Level Security)**: Implementado en todas las tablas
- **Índices**: Optimizados para consultas frecuentes
- **Vistas**: Vistas útiles para consultas comunes
- **Triggers**: Automatización de creación de usuarios
- **Políticas**: Control de acceso granular por usuario
