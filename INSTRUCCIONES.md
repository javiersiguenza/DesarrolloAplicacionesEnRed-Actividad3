# 🚀 Guía Rápida de Inicio

## Instalación

```bash
npm install
```

## Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en: http://localhost:4200

## Si hay problemas con CORS

```bash
npm run start:proxy
```

## Estructura de la aplicación

```
src/app/
├── components/
│   ├── filtros/       → Formulario de búsqueda
│   └── resultados/    → Visualización de resultados
├── services/
│   └── gasolinera.service.ts → Lógica de API
└── models/
    └── gasolinera.model.ts   → Interfaces TypeScript
```

## Funcionalidades principales

✅ Geolocalización automática
✅ Búsqueda por radio de distancia
✅ Filtrado por tipo de combustible
✅ Filtrado por marcas (whitelist/blacklist)
✅ Identificación de gasolinera más barata
✅ Identificación de gasolinera más cercana
✅ Estadísticas de precios

## Datos de la API

**Fuente**: Ministerio para la Transformación Digital y Función Pública

**URL**: https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/

**Formato**: JSON

## Requisitos

- Node.js 18+
- npm 9+
- Navegador moderno con soporte para Geolocation API

## Permisos necesarios

La aplicación solicitará permiso para acceder a tu ubicación. Esto es opcional, ya que también puedes introducir las coordenadas manualmente.

## Ejemplo de uso

1. Abre http://localhost:4200
2. Haz clic en "📍 Usar mi ubicación" o introduce coordenadas manualmente
3. Ajusta el radio de búsqueda (por defecto 10 km)
4. Selecciona el tipo de combustible
5. Opcionalmente, filtra por marcas
6. Haz clic en "🔍 Buscar gasolineras"
7. Revisa los resultados y estadísticas

## Coordenadas de ejemplo

- **Madrid**: 40.4168, -3.7038
- **Barcelona**: 41.3851, 2.1734
- **Valencia**: 39.4699, -0.3763
- **Sevilla**: 37.3891, -5.9845
- **Bilbao**: 43.2630, -2.9340

## Problemas comunes

### Error de CORS
**Solución**: Ejecutar con `npm run start:proxy`

### No se encuentra ubicación
**Solución**: 
1. Verifica permisos del navegador
2. Usa HTTPS o localhost
3. Introduce coordenadas manualmente

### La API no responde
**Solución**: Verifica tu conexión a internet y que la API del gobierno esté disponible

## Build para producción

```bash
npm run build
```

Los archivos se generarán en `dist/gasolineras-app/`

---

**Actividad 3 - Desarrollo de Aplicaciones en Red**
