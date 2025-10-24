import { Routes } from '@angular/router';

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: 'lista-productos',
    loadComponent: () => import('./page/lista-productos-page/lista-productos-page').then(m => m.ListaProductosPage)
  }
];
