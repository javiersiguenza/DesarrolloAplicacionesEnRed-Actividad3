import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { GasolineraService } from './services/gasolinera.service';
import { Gasolinera, FiltrosBusqueda } from './models/gasolinera.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FiltrosComponent, ResultadosComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gasolineras: Gasolinera[] = [];
  gasolinerasFiltradas: Gasolinera[] = [];
  cargando: boolean = false;
  error: string = '';
  tipoCombustibleSeleccionado: string = 'Precio Gasolina 95 E5';
  busquedaRealizada: boolean = false;

  constructor(private gasolineraService: GasolineraService) {}

  ngOnInit() {
    // No es necesario hacer nada aquí, la búsqueda inicial se realiza desde filtros.component
  }

  /**
   * Maneja la búsqueda con los filtros aplicados
   */
  async buscarGasolineras(filtros: FiltrosBusqueda) {
    this.cargando = true;
    this.error = '';
    this.tipoCombustibleSeleccionado = filtros.tipoCombustible;
    this.busquedaRealizada = true;

    try {
      // Obtener todas las gasolineras de la API
      this.gasolineraService.obtenerGasolineras().subscribe({
        next: (gasolineras) => {
          // Calcular distancias
          const gasolinerasConDistancia = gasolineras.map(gasolinera => {
            const latGasolinera = parseFloat(gasolinera['Latitud']);
            const lonGasolinera = parseFloat(gasolinera['Longitud (WGS84)']);
            
            const distancia = this.gasolineraService.calcularDistancia(
              filtros.coordenadas,
              { latitud: latGasolinera, longitud: lonGasolinera }
            );

            return {
              ...gasolinera,
              distancia: distancia
            };
          });

          // Aplicar filtros
          let resultado = gasolinerasConDistancia;

          // Filtro por radio de distancia
          resultado = resultado.filter(g => 
            g.distancia !== undefined && g.distancia <= filtros.radioKm
          );

          // Filtro por tipo de combustible (que tengan precio)
          resultado = resultado.filter(g => {
            const precio = g[filtros.tipoCombustible as keyof Gasolinera] as string;
            return precio && precio !== '';
          });

          // Filtro por marcas
          if (filtros.tipoFiltroMarcas === 'whitelist' && filtros.marcas.length > 0) {
            resultado = resultado.filter(g => 
              filtros.marcas.includes(g['Rótulo'])
            );
          } else if (filtros.tipoFiltroMarcas === 'blacklist' && filtros.marcas.length > 0) {
            resultado = resultado.filter(g => 
              !filtros.marcas.includes(g['Rótulo'])
            );
          }

          // Filtro por gasolineras abiertas
          if (filtros.soloAbiertas) {
            resultado = resultado.filter(g => 
              this.gasolineraService.estaAbierta(g['Horario'])
            );
          }

          // Ordenar por distancia
          resultado.sort((a, b) => {
            const distanciaA = a.distancia || Infinity;
            const distanciaB = b.distancia || Infinity;
            return distanciaA - distanciaB;
          });

          this.gasolinerasFiltradas = resultado;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al obtener gasolineras:', error);
          this.error = 'Error al obtener los datos de gasolineras. Por favor, intenta de nuevo.';
          this.cargando = false;
        }
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      this.error = 'Ocurrió un error durante la búsqueda. Por favor, intenta de nuevo.';
      this.cargando = false;
    }
  }
}
