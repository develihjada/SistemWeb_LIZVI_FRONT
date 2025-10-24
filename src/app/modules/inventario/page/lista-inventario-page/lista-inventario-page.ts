import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';

interface InventoryDocument {
    id: number;
    folio: string;
    type: 'Entrada de Almacén' | 'Salida de Almacén' | 'Conteo Físico';
    date: Date;
    status: 'Pendiente' | 'Completado' | 'Cancelado';
    totalItems: number;
}

@Component({
  selector: 'app-lista-inventario-page',
  imports: [CommonModule],
  templateUrl: './lista-inventario-page.html',
  styleUrl: './lista-inventario-page.css'
})
export class ListaInventarioPage {

  private location = inject(Location)

  // Datos de ejemplo para la tabla de encabezados
  documents: InventoryDocument[] = [
    { id: 101, folio: 'ENT-2025-001', type: 'Entrada de Almacén', date: new Date(2025, 9, 20), status: 'Completado', totalItems: 45 },
    { id: 102, folio: 'SAL-2025-015', type: 'Salida de Almacén', date: new Date(2025, 10, 2), status: 'Pendiente', totalItems: 12 },
    { id: 103, folio: 'CON-2025-005', type: 'Conteo Físico', date: new Date(2025, 10, 21), status: 'Pendiente', totalItems: 80 },
    { id: 104, folio: 'ENT-2025-002', type: 'Entrada de Almacén', date: new Date(2025, 9, 15), status: 'Cancelado', totalItems: 30 },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Método para el botón principal "Nuevo Documento"
  crearNuevoDocumento(): void {
    console.log('--- ACCIÓN FUTURA: Navegando a la creación de un nuevo encabezado de inventario ---');
    // Ejemplo: this.router.navigate(['/inventario/nuevo-documento']);
  }

  // Método para el botón "Ver Detalle"
  verDetalle(id: number): void {
    console.log(`--- ACCIÓN PRINCIPAL: Navegando al detalle del documento ID: ${id} para ver sus productos. ---`);
    // Aquí navegarás a la vista que lista los productos (el detalle) del documento con este ID.
    // Ejemplo: this.router.navigate(['/inventario/detalle', id]);
  }

  // Método para el botón de Volver
  volverInicio(): void {
    this.location.back();
  }
}
