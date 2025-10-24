import { Routes } from '@angular/router';

export const SUBFAMILIA_ROUTES: Routes = [
  {
    path: 'lista-subfamilia',
    loadComponent: () => import('./page/listar-subfamilia-page/listar-subfamilia-page').then(m => m.ListarSubfamiliaPage)
  }
];
