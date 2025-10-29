# 🚀 Despliegue en Vercel - Lizvi EIRL

## Configuración rápida - Variables de entorno configuradas ✅

### 1. **Conectar repositorio a Vercel:**
- Ve a [vercel.com](https://vercel.com)
- Conecta tu repositorio de GitHub
- Selecciona este proyecto

### 2. **Configurar variables de entorno en Vercel:**

En el dashboard de Vercel > Settings > Environment Variables, agrega:

```bash
API_URL=https://tu-api-backend.com/api
PRODUCTION=true
```

### 3. **Desplegar:**
- Vercel detectará automáticamente que es un proyecto Angular
- Usará la configuración de `vercel.json`
- Build command: `npm run build:vercel`
- Output directory: `dist/SistemWeb_LIZVI_FRONT`

## 📋 Scripts disponibles

```bash
# Build para Vercel
npm run build:vercel

# Build para desarrollo
npm run build

# Build para Google Cloud (futuro)
npm run build:gcloud
```

## 🔧 Configuración automática

El proyecto incluye:
- ✅ `vercel.json` configurado
- ✅ Variables de entorno automáticas
- ✅ Routing SPA configurado
- ✅ Headers de seguridad
- ✅ Cache optimizado para assets

## 🌐 URL de ejemplo

Después del despliegue, tu aplicación estará disponible en:
`https://tu-proyecto.vercel.app`
