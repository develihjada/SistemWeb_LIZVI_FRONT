import { Routes } from '@angular/router';

export const LOGIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./page/login-page/login-page').then(m => m.LoginPage)
  },

];
