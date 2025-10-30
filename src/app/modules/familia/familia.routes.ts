import { Routes } from '@angular/router';

export const FAMILIA_ROUTES: Routes = [
  {
    path: 'lista-familia',
    loadComponent: () => import('./page/lista-familia-page/lista-familia-page').then(m => m.ListaFamiliaPage)
  },
  {
    path: 'registro-familia',
    loadComponent: () => import('./page/registro-familia-page/registro-familia-page').then(m => m.RegistroFamiliaPage)
  },
  {
    path: 'editar-familia/:id',
    loadComponent: () => import('./page/editar-familia-page/editar-familia-page').then(m => m.EditarFamiliaPage)
  },
  {
    path: 'detalle-familia/:id',
    loadComponent: () => import('./page/detalle-familia-page/detalle-familia-page').then(m => m.DetalleFamiliaPage)
  }
];
