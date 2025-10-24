import { PRODUCTOS_ROUTES } from './modules/producto/productos.routes';
import { Routes } from '@angular/router';
import { LOGIN_ROUTES } from './modules/login/login.routes';
import { INICIO_ROUTES } from './modules/inicio/inicio.routes';
import { VENTAS_ROUTES } from './modules/ventas/ventas.routes';
import { CONFIGURACIONES_ROUTES } from './modules/configuracion/configuracion.routes';
import { INVENTARIO_ROUTES } from './modules/inventario/inventario.routes';
import { FAMILIA_ROUTES } from './modules/familia/familia.routes';
import { SUBFAMILIA_ROUTES } from './modules/subfamilia/subFamilia.routes';
import { clienteRoutes } from './modules/cliente/cliente.routes';

export const routes: Routes = [
  ...LOGIN_ROUTES,
  ...INICIO_ROUTES,
  ...VENTAS_ROUTES,
  ...CONFIGURACIONES_ROUTES,
  ...INVENTARIO_ROUTES,
  ...FAMILIA_ROUTES,
  ...SUBFAMILIA_ROUTES,
  ...PRODUCTOS_ROUTES,
  {
    path: 'cliente',
    children: clienteRoutes
  }
];
