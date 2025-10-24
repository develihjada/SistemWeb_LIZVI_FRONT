import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

  private routes: Router;

  constructor() {
    this.routes = inject(Router);
  }

  login() {
    console.log("entro a inicio");

    this.routes.navigateByUrl('/inicio');
  }
}
