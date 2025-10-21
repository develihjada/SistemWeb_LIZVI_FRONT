import { Routes } from '@angular/router';
import { LOGIN_ROUTES } from './modules/login/login.routes';
import { INICIO_ROUTES } from './modules/inicio/inicio.routes';
import { VENTAS_ROUTES } from './modules/ventas/ventas.routes';
import { CONFIGURACIONES_ROUTES } from './modules/configuracion/configuracion.routes';

export const routes: Routes = [
  ...LOGIN_ROUTES,
  ...INICIO_ROUTES,
  ...VENTAS_ROUTES,
  ...CONFIGURACIONES_ROUTES
];
