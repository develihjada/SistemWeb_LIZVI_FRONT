import { Routes } from '@angular/router';

export const UNIDADMEDIDA_ROUTES: Routes = [
  {
    path: 'lista-unidad-medida',
    loadComponent: () =>
      import('./page/lista-unidades-medida-page/lista-unidades-medida-page').then(
        (m) => m.ListaUnidadesMedidaPage
      ),
    title: 'Unidades de Medida'
  },
  {
    path: 'registro-unidad-medida',
    loadComponent: () =>
      import('./page/registro-unidad-medida-page/registro-unidad-medida-page').then(
        (m) => m.RegistroUnidadMedidaPage
      ),
    title: 'Registrar Unidad de Medida'
  }
];
