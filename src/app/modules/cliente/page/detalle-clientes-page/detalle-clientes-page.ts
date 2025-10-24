import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-clientes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-clientes-page.html',
  styleUrls: ['./detalle-clientes-page.css']
})
export class DetalleClientesPage implements OnInit {

  clienteId: number = 0;
  cliente = {
    id: 0,
    nombres: '',
    apellidos: '',
    estado: 1
  };

  isLoading = true;

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
    this.isLoading = true;

    // Simular carga de datos
    setTimeout(() => {
      this.cliente = {
        id: this.clienteId,
        nombres: 'Cliente Ejemplo',
        apellidos: 'Apellidos Ejemplo',
        estado: 1
      };
      this.isLoading = false;
    }, 1000);
  }

  editarCliente() {
    this.router.navigate(['/cliente/editar-cliente', this.clienteId]);
  }

  eliminarCliente() {
    if (confirm('¿Está seguro que desea eliminar este cliente?')) {
      console.log('Eliminar cliente:', this.clienteId);
      this.router.navigate(['/cliente']);
    }
  }

  volver() {
    this.router.navigate(['/cliente']);
  }

  volverCatalogos(): void {
    this.location.back();
  }
}
