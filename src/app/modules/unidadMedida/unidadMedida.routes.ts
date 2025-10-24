import { Routes } from '@angular/router';
import { ListaUnidadesMedidaPage } from './page/lista-unidades-medida-page/lista-unidades-medida-page';

export const unidadMedidaRoutes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    component: ListaUnidadesMedidaPage,
    title: 'Unidades de Medida'
  }
];