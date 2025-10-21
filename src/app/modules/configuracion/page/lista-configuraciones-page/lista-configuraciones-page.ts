import { CommonModule, Location, NgClass } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-lista-configuraciones-page',
  imports: [NgClass, CommonModule],
  templateUrl: './lista-configuraciones-page.html',
  styleUrl: './lista-configuraciones-page.css'
})
export class ListaConfiguracionesPage {
 activeTab: 'general' | 'catalogos' | 'usuarios' | 'sistema' = 'general';


   private location = inject(Location);

  constructor(private el: ElementRef ) { }

  ngOnInit(): void {
  }

  // Método CRUCIAL que se llama al hacer clic en las pestañas para cambiar el contenido.
  setActiveTab(tabName: 'general' | 'catalogos' | 'usuarios' | 'sistema'): void {
    this.activeTab = tabName;

    // (Lógica de scrollIntoView omitida aquí para concisión, pero funcional en el TS anterior)
  }

  goToManagement(module: string): void {
    console.log(`Simulando navegación a la gestión de: ${module}`);
  }

  volverInicio(): void {
    this.location.back();
  }
}
