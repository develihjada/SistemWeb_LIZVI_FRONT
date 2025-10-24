import { Routes } from '@angular/router';

export const FAMILIA_ROUTES: Routes = [
  {
    path: 'lista-familia',
    loadComponent: () => import('./page/lista-familia-page/lista-familia-page').then(m => m.ListaFamiliaPage)
  }
];
