import { Routes } from '@angular/router';

export const UNIDADMEDIDA_ROUTES: Routes = [
  {
    path: 'lista-unidad-medida',
    loadComponent: () =>
      import('./page/lista-unidades-medida-page/lista-unidades-medida-page').then(
        (m) => m.ListaUnidadesMedidaPage
      ),
    title: 'Unidades de Medida'
  }
];
