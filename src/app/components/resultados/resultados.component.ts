import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gasolinera } from '../../models/gasolinera.model';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent {
  @Input() gasolineras: Gasolinera[] = [];
  @Input() cargando: boolean = false;
  @Input() tipoCombustible: string = 'Precio Gasolina 95 E5';

  // Exponer Math para usar en el template
  Math = Math;

  // Propiedades de paginación
  paginaActual: number = 1;
  resultadosPorPagina: number = 10;

  /**
   * Obtiene las gasolineras de la página actual
   */
  obtenerGasolinerasPaginadas(): Gasolinera[] {
    const inicio = (this.paginaActual - 1) * this.resultadosPorPagina;
    const fin = inicio + this.resultadosPorPagina;
    return this.gasolineras.slice(inicio, fin);
  }

  /**
   * Obtiene el número total de páginas
   */
  obtenerTotalPaginas(): number {
    return Math.ceil(this.gasolineras.length / this.resultadosPorPagina);
  }

  /**
   * Navega a una página específica
   */
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.obtenerTotalPaginas()) {
      this.paginaActual = pagina;
      // Scroll suave hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Va a la página anterior
   */
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Va a la página siguiente
   */
  paginaSiguiente(): void {
    if (this.paginaActual < this.obtenerTotalPaginas()) {
      this.paginaActual++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Obtiene un array de números de página para mostrar
   */
  obtenerPaginasVisibles(): number[] {
    const totalPaginas = this.obtenerTotalPaginas();
    const paginasAMostrar = 5;
    const paginas: number[] = [];

    let inicio = Math.max(1, this.paginaActual - Math.floor(paginasAMostrar / 2));
    let fin = Math.min(totalPaginas, inicio + paginasAMostrar - 1);

    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < paginasAMostrar - 1) {
      inicio = Math.max(1, fin - paginasAMostrar + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  /**
   * Cambia el número de resultados por página
   */
  cambiarResultadosPorPagina(cantidad: number): void {
    this.resultadosPorPagina = cantidad;
    this.paginaActual = 1;
  }

  /**
   * Obtiene el precio del combustible seleccionado para una gasolinera
   */
  obtenerPrecio(gasolinera: Gasolinera): string {
    const precio = gasolinera[this.tipoCombustible as keyof Gasolinera] as string;
    if (!precio || precio === '') return 'N/D';
    return precio + ' €/L';
  }

  /**
   * Obtiene el precio numérico para comparaciones
   */
  obtenerPrecioNumerico(gasolinera: Gasolinera): number {
    const precio = gasolinera[this.tipoCombustible as keyof Gasolinera] as string;
    if (!precio || precio === '') return 0;
    return parseFloat(precio.replace(',', '.'));
  }

  /**
   * Verifica si es la gasolinera más barata
   */
  esMasBarata(gasolinera: Gasolinera): boolean {
    if (this.gasolineras.length === 0) return false;
    
    const precios = this.gasolineras
      .map(g => this.obtenerPrecioNumerico(g))
      .filter(p => p > 0);
    
    if (precios.length === 0) return false;
    
    const precioMinimo = Math.min(...precios);
    const precioActual = this.obtenerPrecioNumerico(gasolinera);
    
    return precioActual === precioMinimo && precioActual > 0;
  }

  /**
   * Verifica si es la gasolinera más cercana
   */
  esMasCercana(gasolinera: Gasolinera): boolean {
    if (this.gasolineras.length === 0 || !gasolinera.distancia) return false;
    
    const distancias = this.gasolineras
      .map(g => g.distancia || Infinity)
      .filter(d => d !== Infinity);
    
    if (distancias.length === 0) return false;
    
    const distanciaMinima = Math.min(...distancias);
    return gasolinera.distancia === distanciaMinima;
  }

  /**
   * Obtiene las estadísticas de la búsqueda
   */
  obtenerEstadisticas(): {
    total: number;
    masBarata: Gasolinera | null;
    masCercana: Gasolinera | null;
    precioPromedio: number;
  } {
    if (this.gasolineras.length === 0) {
      return {
        total: 0,
        masBarata: null,
        masCercana: null,
        precioPromedio: 0
      };
    }

    const gasolinerasConPrecio = this.gasolineras.filter(g => this.obtenerPrecioNumerico(g) > 0);
    
    const masBarata = gasolinerasConPrecio.length > 0 
      ? gasolinerasConPrecio.reduce((prev, current) => 
          this.obtenerPrecioNumerico(prev) < this.obtenerPrecioNumerico(current) ? prev : current
        )
      : null;

    const gasolinerasConDistancia = this.gasolineras.filter(g => g.distancia !== undefined);
    const masCercana = gasolinerasConDistancia.length > 0
      ? gasolinerasConDistancia.reduce((prev, current) => 
          (prev.distancia || Infinity) < (current.distancia || Infinity) ? prev : current
        )
      : null;

    const precioPromedio = gasolinerasConPrecio.length > 0
      ? gasolinerasConPrecio.reduce((sum, g) => sum + this.obtenerPrecioNumerico(g), 0) / gasolinerasConPrecio.length
      : 0;

    return {
      total: this.gasolineras.length,
      masBarata,
      masCercana,
      precioPromedio
    };
  }

  /**
   * Obtiene el nombre del combustible seleccionado
   */
  obtenerNombreCombustible(): string {
    const nombres: { [key: string]: string } = {
      'Precio Gasolina 95 E5': 'Gasolina 95',
      'Precio Gasolina 98 E5': 'Gasolina 98',
      'Precio Gasoleo A': 'Diésel',
      'Precio Gasoleo Premium': 'Diésel Premium'
    };
    return nombres[this.tipoCombustible] || this.tipoCombustible;
  }
}
