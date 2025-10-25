import { Routes } from '@angular/router';
import { ListaMarcasPage } from './page/lista-marcas-page/lista-marcas-page';

export const marcaRoutes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    component: ListaMarcasPage,
    title: 'Marcas'
  }
];

export const MARCA_ROUTES: Routes = [
  {
    path: 'catalogos/marcas',
    children: marcaRoutes
  }
];
