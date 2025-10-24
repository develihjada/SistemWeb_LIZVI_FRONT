import { Routes } from '@angular/router';

export const clienteRoutes: Routes = [
  {
    path: '',
    redirectTo: 'lista-clientes',
    pathMatch: 'full'
  },
  {
    path: 'lista-clientes',
    loadComponent: () =>
      import('./page/lista-clientes-page/lista-clientes-page').then(
        (m) => m.ListaClientesPage
      ),
  },
  {
    path: 'registrar-cliente',
    loadComponent: () =>
      import('./page/registrar-clientes-page/registrar-clientes-page').then(
        (m) => m.RegistrarClientesPage
      ),
  },
  {
    path: 'editar-cliente/:id',
    loadComponent: () =>
      import('./page/editar-clientes-page/editar-clientes-page').then(
        (m) => m.EditarClientesPage
      ),
  },
  {
    path: 'detalle-cliente/:id',
    loadComponent: () =>
      import('./page/detalle-clientes-page/detalle-clientes-page').then(
        (m) => m.DetalleClientesPage
      ),
  }
];
