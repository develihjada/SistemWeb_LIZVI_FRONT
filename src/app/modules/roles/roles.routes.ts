import { Routes } from '@angular/router';

export const rolesRoutes: Routes = [
  {
    path: 'lista-roles',
    loadComponent: () => import('./page/lista-roles-page/lista-roles-page').then(m => m.ListaRolesPage)
  },
  {
    path: 'registro-roles',
    loadComponent: () => import('./page/registro-roles-page/registro-roles-page').then(m => m.RegistroRolesPage)
  },
  {
    path: '',
    redirectTo: 'lista-roles',
    pathMatch: 'full'
  }
];
