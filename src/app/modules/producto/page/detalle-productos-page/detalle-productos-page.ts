import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { ProductoModel } from '../../../../core/models/producto/producto.model';
import { MapingDetalleProductos } from '../../../../core/models/producto/response/detalleProducto.response';

@Component({
  selector: 'app-detalle-productos-page',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './detalle-productos-page.html',
  styleUrl: './detalle-productos-page.css'
})
export class DetalleProductosPage implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);

  producto: MapingDetalleProductos | null = null;
  isLoading = false;
  errorMessage = '';
  productoId: number = 0;

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this.route.params.subscribe(params => {
      this.productoId = Number(params['id']);
      if (this.productoId && this.productoId > 0) {
        this.cargarProducto();
      } else {
        this.errorMessage = 'ID de producto no válido';
      }
    });
  }

  cargarProducto(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request = { id: this.productoId };

    this.productosService.detalleProducto(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.exito) {
          this.producto = response.producto;
        } else {
          this.errorMessage = response.mensaje || 'Error al cargar el producto';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar producto:', error);
        this.errorMessage = 'Error de conexión. No se pudo cargar el producto.';
      }
    });
  }

  volverCatalogos(): void {
    this.router.navigate(['/lista-productos']);
  }

  editarProducto(): void {
    this.router.navigate(['/editar-productos', this.productoId]);
  }
}
