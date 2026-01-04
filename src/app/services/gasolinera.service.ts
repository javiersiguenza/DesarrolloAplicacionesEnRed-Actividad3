import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Gasolinera, Coordenadas } from '../models/gasolinera.model';

@Injectable({
  providedIn: 'root'
})
export class GasolineraService {
  private apiUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las gasolineras desde la API del gobierno
   */
  obtenerGasolineras(): Observable<Gasolinera[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => {
        if (response && response.ListaEESSPrecio) {
          return response.ListaEESSPrecio.map(gasolinera => {
            // Normalizar los datos
            return {
              ...gasolinera,
              'Latitud': this.normalizarCoordenada(gasolinera['Latitud']),
              'Longitud (WGS84)': this.normalizarCoordenada(gasolinera['Longitud (WGS84)']),
              'Precio Gasolina 95 E5': this.normalizarPrecio(gasolinera['Precio Gasolina 95 E5']),
              'Precio Gasoleo A': this.normalizarPrecio(gasolinera['Precio Gasoleo A']),
              'Precio Gasolina 98 E5': this.normalizarPrecio(gasolinera['Precio Gasolina 98 E5']),
              'Precio Gasoleo Premium': this.normalizarPrecio(gasolinera['Precio Gasoleo Premium'])
            };
          });
        }
        return [];
      })
    );
  }

  /**
   * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine
   */
  calcularDistancia(coord1: Coordenadas, coord2: Coordenadas): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(coord2.latitud - coord1.latitud);
    const dLon = this.toRad(coord2.longitud - coord1.longitud);
    
    const lat1 = this.toRad(coord1.latitud);
    const lat2 = this.toRad(coord2.latitud);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  /**
   * Obtiene la ubicación actual del usuario mediante geolocalización
   */
  obtenerUbicacionActual(): Promise<Coordenadas> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada por este navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Verifica si una gasolinera está abierta según su horario
   */
  estaAbierta(horario: string): boolean {
    if (!horario || horario.toLowerCase().includes('24h') || horario.toLowerCase().includes('l-d: 24h')) {
      return true; // Abierta 24 horas
    }

    // Para simplificar, consideramos que todas están abiertas
    // En una implementación real, habría que parsear el horario
    return true;
  }

  /**
   * Obtiene el precio de un combustible específico
   */
  obtenerPrecio(gasolinera: Gasolinera, tipoCombustible: string): number {
    const precioStr = gasolinera[tipoCombustible as keyof Gasolinera] as string;
    if (!precioStr || precioStr === '') return 0;
    return parseFloat(precioStr.replace(',', '.'));
  }

  /**
   * Normaliza una coordenada reemplazando comas por puntos
   */
  private normalizarCoordenada(coordenada: string): string {
    if (!coordenada) return '0';
    return coordenada.replace(',', '.');
  }

  /**
   * Normaliza un precio reemplazando comas por puntos
   */
  private normalizarPrecio(precio: string): string {
    if (!precio || precio === '') return '';
    return precio.replace(',', '.');
  }

  /**
   * Convierte grados a radianes
   */
  private toRad(grados: number): number {
    return grados * Math.PI / 180;
  }

  /**
   * Obtiene las marcas únicas de todas las gasolineras
   */
  obtenerMarcasUnicas(gasolineras: Gasolinera[]): string[] {
    const marcas = gasolineras
      .map(g => g['Rótulo'])
      .filter(m => m && m.trim() !== '');
    
    return Array.from(new Set(marcas)).sort();
  }
}
