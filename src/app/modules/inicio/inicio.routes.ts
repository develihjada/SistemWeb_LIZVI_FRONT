import { Routes } from '@angular/router';

export const INICIO_ROUTES: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./page/inicio-page/inicio-page').then(m => m.InicioPage)
  }
];
