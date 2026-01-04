export interface Gasolinera {
  'IDEESS': string;
  'Rótulo': string;
  'Dirección': string;
  'Localidad': string;
  'Provincia': string;
  'Latitud': string;
  'Longitud (WGS84)': string;
  'Horario': string;
  'Precio Gasolina 95 E5': string;
  'Precio Gasoleo A': string;
  'Precio Gasolina 98 E5': string;
  'Precio Gasoleo Premium': string;
  distancia?: number;
}

export interface ApiResponse {
  Fecha: string;
  ListaEESSPrecio: Gasolinera[];
  Nota: string;
  ResultadoConsulta: string;
}

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface FiltrosBusqueda {
  coordenadas: Coordenadas;
  radioKm: number;
  tipoCombustible: string;
  marcas: string[];
  soloAbiertas: boolean;
  tipoFiltroMarcas: 'blacklist' | 'whitelist' | 'none';
}
