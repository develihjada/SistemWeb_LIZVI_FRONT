import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';

interface ProductSubfamily {
    id: number;
    name: string;
    parentFamily: string;
    productsCount: number; // Cantidad de productos asociados
}
@Component({
  selector: 'app-listar-subfamilia-page',
  imports: [CommonModule],
  templateUrl: './listar-subfamilia-page.html',
  styleUrl: './listar-subfamilia-page.css'
})
export class ListarSubfamiliaPage {

  private location = inject(Location);

  // Datos de ejemplo para la tabla de subfamilias
  subfamilies: ProductSubfamily[] = [
    { id: 10, name: 'Laptops', parentFamily: 'Electrónica', productsCount: 20 },
    { id: 11, name: 'Monitores', parentFamily: 'Electrónica', productsCount: 15 },
    { id: 20, name: 'Camisetas', parentFamily: 'Ropa y Vestido', productsCount: 45 },
    { id: 21, name: 'Pantalones', parentFamily: 'Ropa y Vestido', productsCount: 30 },
    { id: 30, name: 'Utensilios', parentFamily: 'Hogar y Decoración', productsCount: 10 },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Método para el botón principal "Nueva Subfamilia"
  registrarSubfamilia(): void {
    console.log('--- ACCIÓN FUTURA: Navegando al formulario para crear una nueva subfamilia ---');
    // Ejemplo: this.router.navigate(['/catalogos/subfamilias/registrar']);
  }

  // Método para la acción de Editar en la tabla
  editarSubfamilia(id: number): void {
    console.log(`--- ACCIÓN FUTURA: Editando la subfamilia con ID: ${id} ---`);
    // Ejemplo: this.router.navigate(['/catalogos/subfamilias/editar', id]);
  }

  // Método para la acción de Eliminar en la tabla
  eliminarSubfamilia(id: number): void {
    if (confirm(`¿Estás seguro de eliminar la subfamilia con ID ${id}? Esto afectará a sus productos asociados.`)) {
      console.log(`Subfamilia ${id} marcada para eliminación.`);
      // Lógica de eliminación...
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.location.back();
  }
}
