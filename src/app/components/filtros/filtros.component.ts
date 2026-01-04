import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltrosBusqueda, Coordenadas } from '../../models/gasolinera.model';
import { GasolineraService } from '../../services/gasolinera.service';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent implements OnInit {
  @Output() buscar = new EventEmitter<FiltrosBusqueda>();

  // Datos del formulario
  latitud: number = 40.4168; // Madrid por defecto
  longitud: number = -3.7038;
  radioKm: number = 10;
  tipoCombustible: string = 'Precio Gasolina 95 E5';
  soloAbiertas: boolean = false;
  tipoFiltroMarcas: 'none' | 'whitelist' | 'blacklist' = 'none';
  marcasSeleccionadas: string[] = [];
  
  // Control de UI
  cargandoUbicacion: boolean = false;
  errorUbicacion: string = '';
  mensajeExito: string = '';
  
  // Marcas disponibles (se cargarán dinámicamente)
  marcasDisponibles: string[] = [];

  tiposCombustible = [
    { valor: 'Precio Gasolina 95 E5', texto: 'Gasolina 95' },
    { valor: 'Precio Gasolina 98 E5', texto: 'Gasolina 98' },
    { valor: 'Precio Gasoleo A', texto: 'Diésel' },
    { valor: 'Precio Gasoleo Premium', texto: 'Diésel Premium' }
  ];

  constructor(private gasolineraService: GasolineraService) {}

  ngOnInit() {
    // Solicitar ubicación automáticamente al cargar
    this.solicitarUbicacionInicial();

    // Cargar marcas disponibles
    this.gasolineraService.obtenerGasolineras().subscribe({
      next: (gasolineras) => {
        this.marcasDisponibles = this.gasolineraService.obtenerMarcasUnicas(gasolineras);
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
      }
    });
  }

  /**
   * Solicita la ubicación al cargar la página
   */
  async solicitarUbicacionInicial() {
    try {
      this.cargandoUbicacion = true;
      const coordenadas = await this.gasolineraService.obtenerUbicacionActual();
      this.latitud = coordenadas.latitud;
      this.longitud = coordenadas.longitud;
      this.mensajeExito = '✓ Ubicación obtenida correctamente';
      
      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    } catch (error) {
      // Si el usuario rechaza o hay error, simplemente usamos las coordenadas por defecto
      console.log('No se pudo obtener la ubicación automáticamente, usando coordenadas por defecto');
    } finally {
      this.cargandoUbicacion = false;
    }
  }

  /**
   * Obtiene la ubicación actual del usuario
   */
  async obtenerUbicacionActual() {
    this.cargandoUbicacion = true;
    this.errorUbicacion = '';
    this.mensajeExito = '';

    try {
      const coordenadas = await this.gasolineraService.obtenerUbicacionActual();
      this.latitud = coordenadas.latitud;
      this.longitud = coordenadas.longitud;
      this.mensajeExito = '✓ Ubicación obtenida correctamente';
      
      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    } catch (error) {
      this.errorUbicacion = 'No se pudo obtener la ubicación. Verifica los permisos del navegador.';
      console.error('Error de geolocalización:', error);
    } finally {
      this.cargandoUbicacion = false;
    }
  }

  /**
   * Maneja el cambio de selección de marca
   */
  toggleMarca(marca: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.marcasSeleccionadas.includes(marca)) {
        this.marcasSeleccionadas.push(marca);
      }
    } else {
      this.marcasSeleccionadas = this.marcasSeleccionadas.filter(m => m !== marca);
    }
  }

  /**
   * Verifica si una marca está seleccionada
   */
  estaMarcaSeleccionada(marca: string): boolean {
    return this.marcasSeleccionadas.includes(marca);
  }

  /**
   * Emite el evento de búsqueda con los filtros seleccionados
   */
  realizarBusqueda() {
    const filtros: FiltrosBusqueda = {
      coordenadas: {
        latitud: this.latitud,
        longitud: this.longitud
      },
      radioKm: this.radioKm,
      tipoCombustible: this.tipoCombustible,
      marcas: this.marcasSeleccionadas,
      soloAbiertas: this.soloAbiertas,
      tipoFiltroMarcas: this.tipoFiltroMarcas
    };

    this.buscar.emit(filtros);
  }

  /**
   * Resetea todos los filtros a sus valores por defecto
   */
  resetearFiltros() {
    this.latitud = 40.4168;
    this.longitud = -3.7038;
    this.radioKm = 10;
    this.tipoCombustible = 'Precio Gasolina 95 E5';
    this.soloAbiertas = false;
    this.tipoFiltroMarcas = 'none';
    this.marcasSeleccionadas = [];
    this.errorUbicacion = '';
    this.mensajeExito = '';
  }
}

