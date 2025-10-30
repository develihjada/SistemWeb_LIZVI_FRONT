import { CommonModule, Location, NgClass } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-configuraciones-page',
  imports: [NgClass, CommonModule],
  templateUrl: './lista-configuraciones-page.html',
  styleUrl: './lista-configuraciones-page.css'
})
export class ListaConfiguracionesPage {
  activeTab:  'catalogos' | 'usuarios' | 'sistema' = 'catalogos';

  private location: Location;
  private router: Router;

  constructor(private el: ElementRef) {
    this.location = inject(Location);
    this.router = inject(Router);
  }

  ngOnInit(): void {
  }

  setActiveTab(tabName: 'catalogos' | 'usuarios' | 'sistema'): void {
    this.activeTab = tabName;
  }

  goToManagement(module: string): void {
    switch (module) {
      case 'lista-clientes':
        this.router.navigate(['/lista-clientes']);
        break;
      case 'lista-productos':
        this.router.navigate(['/lista-productos']);
        break;
      case 'lista-familia':
        this.router.navigate(['/lista-familia']);
        break;
      case 'lista-subfamilia':
        this.router.navigate(['/lista-subfamilia']);
        break;
      case 'lista-unidad-medida':
        this.router.navigate(['/lista-unidad-medida']);
        break;
      case 'lista-marcas':
        this.router.navigate(['/catalogos/marcas']);
        break;
      case 'roles':
        this.router.navigate(['/lista-roles']);
        break;
      case 'gestion-usuarios':
        this.router.navigate(['/usuarios/lista']);
        break;
      default:
        this.router.navigate([`/${module}`]);
        break;
    }
  }

  volverInicio(): void {
    this.location.back();
  }
}
