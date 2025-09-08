# 🔐 Configuración de Google OAuth en Supabase

## 📋 Requisitos Previos

1. **Cuenta de Google Cloud Platform** activa
2. **Proyecto de Supabase** configurado
3. **Base de datos** con las tablas creadas (ejecutar `scripts/024_fixed_migration.sql`)

## 🚀 Pasos para Configurar Google OAuth

### 1. Configurar Google Cloud Platform

#### 1.1 Crear Proyecto (si no existe)

- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Crea un nuevo proyecto o selecciona uno existente

#### 1.2 Habilitar Google+ API

- En el menú lateral, ve a **APIs & Services** → **Library**
- Busca "Google+ API" y habilítala
- Busca "Google Identity" y habilítala

#### 1.3 Crear Credenciales OAuth 2.0

- Ve a **APIs & Services** → **Credentials**
- Haz clic en **+ CREATE CREDENTIALS** → **OAuth client ID**
- Selecciona **Web application**
- Configura:
  - **Name**: `Genorama Web App`
  - **Authorized JavaScript origins**:
    - `http://localhost:3000` (desarrollo)
    - `https://tu-dominio.com` (producción)
  - **Authorized redirect URIs**:
    - `http://localhost:3000/auth/callback` (desarrollo)
    - `https://tu-dominio.com/auth/callback` (producción)

#### 1.4 Guardar Credenciales

- Anota el **Client ID** y **Client Secret**
- Los necesitarás para configurar Supabase

### 2. Configurar Supabase

#### 2.1 Ir a Authentication Settings

- En tu dashboard de Supabase, ve a **Authentication** → **Settings**
- Busca la sección **OAuth Providers**

#### 2.2 Configurar Google Provider

- Habilita **Google**
- Completa los campos:
  - **Client ID**: El Client ID de Google Cloud
  - **Client Secret**: El Client Secret de Google Cloud
  - **Redirect URL**: Deja el valor por defecto de Supabase

#### 2.3 Guardar Configuración

- Haz clic en **Save**
- Verifica que Google aparezca como **Enabled**

### 3. Configurar Variables de Entorno

#### 3.1 Archivo `.env.local`

```bash
# Supabase
NEXT_PUBLIC_GENO_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_GENO_SUPABASE_ANON_KEY=tu-anon-key

# Google OAuth (opcional, para configuración adicional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 4. Probar la Autenticación

#### 4.1 Iniciar la Aplicación

```bash
npm run dev
```

#### 4.2 Probar el Flujo

1. Ve a `http://localhost:3000/auth`
2. Haz clic en **"Iniciar sesión con Google"**
3. Deberías ser redirigido a Google
4. Después de autenticarte, serás redirigido de vuelta
5. Tu perfil se creará automáticamente

## 🔧 Funcionalidades del Sistema

### ✅ **Características Implementadas:**

- **Login/Registro unificado** con Google
- **Creación automática de perfil** al autenticarse
- **Username generado** desde el nombre de Google
- **Avatar automático** desde Google
- **Preferencias por defecto** creadas automáticamente
- **Middleware de protección** para rutas privadas
- **Redirecciones automáticas** después de la autenticación

### 🎯 **Flujo de Usuario:**

1. Usuario hace clic en "Iniciar sesión con Google"
2. Es redirigido a Google para autenticación
3. Google redirige de vuelta con código de autorización
4. Supabase intercambia el código por una sesión
5. Se crea/actualiza el perfil en la base de datos
6. Usuario es redirigido a la página principal
7. Ya puede acceder a todas las funcionalidades

### 🛡️ **Seguridad:**

- **RLS (Row Level Security)** habilitado en todas las tablas
- **Políticas de acceso** configuradas
- **Middleware** protege rutas privadas
- **Sesiones** manejadas por Supabase

## 🐛 Solución de Problemas

### Error: "OAuth provider not configured"

- Verifica que Google esté habilitado en Supabase
- Confirma que Client ID y Secret sean correctos

### Error: "Redirect URI mismatch"

- Verifica que las URIs en Google Cloud coincidan con las de Supabase
- Asegúrate de incluir tanto desarrollo como producción

### Error: "Invalid client"

- Verifica que el Client ID sea correcto
- Confirma que la API esté habilitada en Google Cloud

### Usuario no se crea automáticamente

- Revisa la consola del navegador para errores
- Verifica que las tablas de la base de datos existan
- Confirma que las políticas RLS permitan inserción

## 📱 Próximos Pasos

1. **Configurar Google OAuth** siguiendo los pasos anteriores
2. **Probar el flujo** de autenticación
3. **Personalizar la UI** según tus necesidades
4. **Agregar más proveedores** OAuth si es necesario
5. **Implementar funcionalidades adicionales** del usuario

## 🎉 ¡Listo!

Una vez configurado, tendrás un sistema de autenticación completo y funcional que:

- ✅ Solo permite login con Google
- ✅ Crea perfiles automáticamente
- ✅ Usa nombres como usernames
- ✅ Protege rutas privadas
- ✅ Maneja sesiones de forma segura

¡Tu aplicación estará lista para usuarios reales! 🚀
