import { Routes } from '@angular/router';

export const CONFIGURACIONES_ROUTES: Routes = [
  {
    path: 'configuraciones',
    loadComponent: () => import('./page/lista-configuraciones-page/lista-configuraciones-page').then(m => m.ListaConfiguracionesPage)
  }
];
