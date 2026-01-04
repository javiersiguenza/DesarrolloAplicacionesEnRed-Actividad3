# 🚗 Actividad 3: Buscador de Gasolineras España

Aplicación web desarrollada en **Angular** que permite buscar y comparar gasolineras en España utilizando la API REST del Ministerio para la Transformación Digital y Función Pública.

## 📋 Descripción

Esta aplicación permite a los usuarios:

- 📍 **Obtener su ubicación** mediante geolocalización o introducción manual de coordenadas
- 🔍 **Buscar gasolineras** dentro de un radio específico
- ⛽ **Filtrar por tipo de combustible** (Gasolina 95, Gasolina 98, Diésel, Diésel Premium)
- 🏢 **Filtrar por marcas** con lista blanca o lista negra
- 💰 **Identificar la gasolinera más barata**
- 🎯 **Encontrar la gasolinera más cercana**
- 📊 **Ver estadísticas** de precios y distancias

## 🎯 Requisitos Cumplidos

✅ **Funcionalidad e interacción con el usuario**
- Búsqueda interactiva con múltiples filtros
- Geolocalización automática
- Entrada manual de coordenadas
- Filtros por combustible, marca y distancia

✅ **Interfaz gráfica**
- Diseño moderno y responsive
- Separación clara entre sección de entrada y salida de datos
- Destacados visuales para mejores opciones
- Grid adaptable para resultados

✅ **Usabilidad**
- Interfaz intuitiva y fácil de usar
- Feedback visual de acciones
- Estados de carga
- Mensajes de error claros

✅ **Uso de framework moderno**
- Desarrollado con Angular 17 (Standalone Components)
- Arquitectura basada en componentes
- Servicios para lógica de negocio

✅ **Uso de API REST**
- Consumo de API en formato JSON
- Peticiones AJAX mediante HttpClient

## 🛠️ Tecnologías Utilizadas

- **Angular 17** - Framework principal
- **TypeScript** - Lenguaje de programación
- **RxJS** - Manejo de operaciones asíncronas
- **HttpClient** - Peticiones HTTP (AJAX)
- **Geolocation API** - Obtención de ubicación del usuario
- **CSS3** - Estilos y diseño responsive

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── filtros/              # Componente de entrada de datos
│   │   │   ├── filtros.component.ts
│   │   │   ├── filtros.component.html
│   │   │   └── filtros.component.css
│   │   └── resultados/           # Componente de salida de datos
│   │       ├── resultados.component.ts
│   │       ├── resultados.component.html
│   │       └── resultados.component.css
│   ├── models/
│   │   └── gasolinera.model.ts   # Interfaces y tipos
│   ├── services/
│   │   └── gasolinera.service.ts # Lógica de negocio y API
│   ├── app.component.ts          # Componente principal
│   ├── app.component.html
│   └── app.component.css
├── index.html
├── main.ts
└── styles.css                    # Estilos globales
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (viene con Node.js)

### Pasos de instalación

1. **Navegar al directorio del proyecto**
   ```bash
   cd "DesarrolloAplicacionesEnRed-Actividad3"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación en modo desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:4200
   ```

### Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run watch` - Compila en modo observación

## 📖 Uso de la Aplicación

### 1. Configurar la ubicación

**Opción A: Geolocalización automática**
- Hacer clic en el botón "📍 Usar mi ubicación"
- Permitir el acceso a la ubicación cuando el navegador lo solicite

**Opción B: Introducción manual**
- Introducir latitud y longitud manualmente
- Por defecto, se usa Madrid (40.4168, -3.7038)

### 2. Configurar filtros

- **Radio de búsqueda**: Distancia máxima en kilómetros (1-100 km)
- **Tipo de combustible**: Seleccionar entre Gasolina 95, 98, Diésel o Diésel Premium
- **Filtro por marcas**: 
  - Sin filtro: Mostrar todas
  - Lista blanca: Solo mostrar marcas seleccionadas
  - Lista negra: Excluir marcas seleccionadas
- **Solo abiertas**: Filtrar por horario de apertura

### 3. Realizar la búsqueda

- Hacer clic en "🔍 Buscar gasolineras"
- Esperar a que se carguen los resultados

### 4. Visualizar resultados

Los resultados muestran:
- **Estadísticas generales**: Total encontradas, más cercana, más barata, precio promedio
- **Destacados**: Tarjetas especiales para la gasolinera más barata y más cercana
- **Lista completa**: Todas las gasolineras con sus detalles

## 🔧 Características Técnicas

### Arquitectura de Componentes

La aplicación sigue el patrón de componentes de Angular:

```
AppComponent (Contenedor principal)
    ├── FiltrosComponent (Entrada de datos)
    └── ResultadosComponent (Salida de datos)
```

### Servicios

**GasolineraService** proporciona:
- `obtenerGasolineras()`: Consulta la API REST
- `calcularDistancia()`: Calcula distancias con fórmula de Haversine
- `obtenerUbicacionActual()`: Usa Geolocation API
- `estaAbierta()`: Verifica horarios
- `obtenerMarcasUnicas()`: Extrae lista de marcas

### Modelos de Datos

```typescript
interface Gasolinera {
  IDEESS: string;
  Rótulo: string;
  Dirección: string;
  Localidad: string;
  Provincia: string;
  Latitud: string;
  'Longitud (WGS84)': string;
  Horario: string;
  'Precio Gasolina 95 E5': string;
  'Precio Gasoleo A': string;
  distancia?: number;
}

interface FiltrosBusqueda {
  coordenadas: Coordenadas;
  radioKm: number;
  tipoCombustible: string;
  marcas: string[];
  soloAbiertas: boolean;
  tipoFiltroMarcas: 'blacklist' | 'whitelist' | 'none';
}
```

### Comunicación entre Componentes

- **@Output y EventEmitter**: FiltrosComponent emite eventos de búsqueda
- **@Input**: ResultadosComponent recibe datos filtrados
- **Servicios compartidos**: GasolineraService inyectado en componentes

### Peticiones AJAX

Se usa `HttpClient` de Angular para realizar peticiones asíncronas:

```typescript
this.http.get<ApiResponse>(apiUrl).pipe(
  map(response => response.ListaEESSPrecio)
)
```

## 🌐 API Utilizada

**URL**: https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/

**Formato**: JSON

**Fuente**: Ministerio para la Transformación Digital y Función Pública

**Documentación**: https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas

## 📱 Responsive Design

La aplicación es completamente responsive y se adapta a:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1199px)
- 🖥️ Escritorio (≥ 1200px)

## 🎨 Diseño UI/UX

- Paleta de colores moderna con gradientes
- Iconos emoji para mejor identificación visual
- Tarjetas con efecto hover
- Badges para destacar información importante
- Estados de carga con spinner animado
- Mensajes de error y éxito contextuales

## 🧮 Algoritmos Implementados

### Cálculo de Distancia (Haversine)

```typescript
calcularDistancia(coord1: Coordenadas, coord2: Coordenadas): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = this.toRad(coord2.latitud - coord1.latitud);
  const dLon = this.toRad(coord2.longitud - coord1.longitud);
  
  const lat1 = this.toRad(coord1.latitud);
  const lat2 = this.toRad(coord2.latitud);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * 
            Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}
```

### Filtrado de Datos

1. **Filtro por distancia**: Elimina gasolineras fuera del radio
2. **Filtro por combustible**: Solo gasolineras con precio del combustible seleccionado
3. **Filtro por marcas**: Aplica lista blanca o negra
4. **Filtro por horario**: Solo gasolineras abiertas (opcional)
5. **Ordenación**: Por distancia ascendente

## ⚠️ Notas Importantes

### CORS (Cross-Origin Resource Sharing)

La API del gobierno puede tener restricciones CORS. Si encuentras problemas:

1. **Usar un proxy de desarrollo**: Configurar en `angular.json`
2. **Extensión de navegador**: Instalar extensión para deshabilitar CORS (solo desarrollo)
3. **Servidor proxy**: Implementar un backend simple que haga de proxy

### Permisos de Geolocalización

Para usar la geolocalización:
- El navegador solicitará permiso al usuario
- Solo funciona en contextos seguros (HTTPS o localhost)
- El usuario puede denegar el permiso

### Rendimiento

- La API devuelve ~11,000 gasolineras
- El filtrado se hace en el cliente
- Para grandes volúmenes, considerar paginación

## 📝 Autor

**Actividad 3 - Desarrollo de Aplicaciones en Red**
Universidad

## 📄 Licencia

Este proyecto es parte de una actividad universitaria.

## 🔗 Referencias

- [Angular Documentation](https://angular.io/docs)
- [API Gasolineras](https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

---

## 🎓 Criterios de Evaluación Cumplidos

### ✅ Funcionalidad e Interacción
- [x] Obtención de datos desde API REST
- [x] Geolocalización del usuario
- [x] Entrada manual de coordenadas
- [x] Filtrado por tipo de combustible
- [x] Filtrado por marcas (whitelist/blacklist)
- [x] Filtrado por distancia
- [x] Cálculo de gasolinera más cercana
- [x] Cálculo de gasolinera más barata
- [x] Información de horarios

### ✅ Interfaz Gráfica
- [x] Diseño responsive
- [x] Sección de entrada de datos diferenciada
- [x] Sección de salida de datos diferenciada
- [x] Información formateada en tarjetas
- [x] Uso de colores y tipografía adecuada

### ✅ Usabilidad
- [x] Interfaz intuitiva
- [x] Feedback visual de acciones
- [x] Manejo de errores
- [x] Estados de carga
- [x] Adaptación a diferentes dispositivos

### ✅ Framework Moderno
- [x] Angular 17 con Standalone Components
- [x] Arquitectura por componentes
- [x] Uso de servicios
- [x] TypeScript
- [x] RxJS para operaciones asíncronas

### ✅ Uso de AJAX
- [x] HttpClient de Angular
- [x] Peticiones asíncronas
- [x] Manejo de errores en peticiones
- [x] Procesamiento de respuestas JSON
