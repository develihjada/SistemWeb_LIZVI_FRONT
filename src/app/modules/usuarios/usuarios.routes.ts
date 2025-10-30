import { Routes } from '@angular/router';

export const usuariosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/lista-usuarios-page/lista-usuarios-page').then(m => m.ListaUsuariosPage)
  },
  {
    path: 'lista',
    loadComponent: () => import('./page/lista-usuarios-page/lista-usuarios-page').then(m => m.ListaUsuariosPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./page/registro-usuarios-page/registro-usuarios-page').then(m => m.RegistroUsuariosPage)
  }
];
