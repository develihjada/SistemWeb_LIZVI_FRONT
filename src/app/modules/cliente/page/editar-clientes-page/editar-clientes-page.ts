import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-clientes-page.html',
  styleUrls: ['./editar-clientes-page.css']
})
export class EditarClientesPage implements OnInit {

  clienteId: number = 0;
  cliente = {
    id: 0,
    nombres: '',
    apellidos: '',
    estado: 1
  };

  isLoading = false;
  isLoadingData = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCliente();
  }

  cargarCliente() {
    this.isLoadingData = true;

    // Simular carga de datos
    setTimeout(() => {
      this.cliente = {
        id: this.clienteId,
        nombres: 'Cliente Ejemplo',
        apellidos: 'Apellidos Ejemplo',
        estado: 1
      };
      this.isLoadingData = false;
    }, 1000);
  }

  onSubmit() {
    if (this.validarFormulario()) {
      this.isLoading = true;

      // Simular actualización
      setTimeout(() => {
        console.log('Cliente actualizado:', this.cliente);
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
