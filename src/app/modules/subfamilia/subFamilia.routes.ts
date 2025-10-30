import { Routes } from '@angular/router';

export const SUBFAMILIA_ROUTES: Routes = [
  {
    path: 'lista-subfamilia',
    loadComponent: () => import('./page/listar-subfamilia-page/listar-subfamilia-page').then(m => m.ListarSubfamiliaPage)
  },
  {
    path: 'registro-subfamilia',
    loadComponent: () => import('./page/registrar-subfamilia-page/registrar-subfamilia-page').then(m => m.RegistrarSubfamiliaPage)
  },
  {
    path: 'editar-subfamilia/:id',
    loadComponent: () => import('./page/editar-subfamilia-page/editar-subfamilia-page').then(m => m.EditarSubfamiliaPage)
  },
  {
    path: 'detalle-subfamilia/:id',
    loadComponent: () => import('./page/detalle-subfamilia-page/detalle-subfamilia-page').then(m => m.DetalleSubfamiliaPage)
  }
];
