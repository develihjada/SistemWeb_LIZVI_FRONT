import { Routes } from '@angular/router';


export const PRODUCTOS_ROUTES: Routes = [
  {
    path: 'lista-productos',
    loadComponent: () => import('./page/lista-productos-page/lista-productos-page').then(m => m.ListaProductosPage)
  },
  {
    path: 'registrar-productos',
    loadComponent: () => import('./page/registrar-productos-page/registrar-productos-page').then(m => m.RegistrarProductosPage)
  },
  {
    path: 'detalle-productos/:id',
    loadComponent: () => import('./page/detalle-productos-page/detalle-productos-page').then(m => m.DetalleProductosPage)
  },
  {
    path: 'editar-productos/:id',
    loadComponent: () => import('./page/editar-productos-page/editar-productos-page').then(m => m.EditarProductosPage)
  }
];
