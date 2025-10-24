import { Routes } from '@angular/router';

export const INVENTARIO_ROUTES: Routes = [
  {
    path: 'lista-inventario',
    loadComponent: () => import('./page/lista-inventario-page/lista-inventario-page').then(m => m.ListaInventarioPage)
  },

];
