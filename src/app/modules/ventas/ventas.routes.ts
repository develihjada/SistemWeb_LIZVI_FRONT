import { Routes } from '@angular/router';

export const VENTAS_ROUTES: Routes = [
  {
    path: 'registrar-ventas',
    loadComponent: () => import('./page/registrar-ventas-page/registrar-ventas-page').then(m => m.RegistrarVentasPage)
  },
  {
    path: 'listado-ventas',
    loadComponent: () => import('./page/listar-ventas-page/listar-ventas-page').then(m => m.ListarVentasPage)
  }
];
