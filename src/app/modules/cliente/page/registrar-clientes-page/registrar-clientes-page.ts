import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-clientes-page.html',
  styleUrls: ['./registrar-clientes-page.css']
})
export class RegistrarClientesPage {

  cliente = {
    nombres: '',
    apellidos: '',
    estado: 1
  };

  isLoading = false;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  onSubmit() {
    if (this.validarFormulario()) {
      this.isLoading = true;

      // Simular guardado
      setTimeout(() => {
        console.log('Cliente registrado:', this.cliente);
        this.isLoading = false;
        this.router.navigate(['/cliente']);
      }, 2000);
    }
  }

  validarFormulario(): boolean {
    if (!this.cliente.nombres.trim()) {
      alert('Los nombres son requeridos');
      return false;
    }
    if (!this.cliente.apellidos.trim()) {
      alert('Los apellidos son requeridos');
      return false;
    }
    return true;
  }

  cancelar() {
    this.router.navigate(['/cliente']);
  }

  volverCatalogos(): void {
    this.location.back();
  }
}
