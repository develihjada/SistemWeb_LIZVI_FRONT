import { Router } from '@angular/router';
import { routes } from './../../../../app.routes';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-inicio-page',
  imports: [],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.css'
})
export class InicioPage {
  private routes = inject(Router)

  irVentas() {
    this.routes.navigateByUrl('/registrar-ventas');
  }

  irConfiguraciones() {
    this.routes.navigateByUrl('/configuraciones');
  }
}
