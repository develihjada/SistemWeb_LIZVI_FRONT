import { CommonModule, Location, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-registrar-ventas-page',
  imports: [NgClass, CommonModule],
  templateUrl: './registrar-ventas-page.html',
  styleUrl: './registrar-ventas-page.css'
})
export class RegistrarVentasPage {

  private location = inject(Location);

  activeTab: 'familias' | 'productos' = 'familias';
  isCartOpen: boolean = false;

  cartItems: CartItem[] = [
    { id: 101, name: 'Laptop X100', quantity: 1, price: 1200.00 },
    { id: 205, name: 'Mouse Óptico', quantity: 2, price: 25.00 },
    { id: 330, name: 'Licencia Software Pro', quantity: 1, price: 450.00 },
    { id: 400, name: 'Cable HDMI 4K', quantity: 3, price: 15.00 },
    { id: 512, name: 'Audífonos Gaming', quantity: 1, price: 75.00 },
    { id: 601, name: 'Teclado Mecánico', quantity: 1, price: 90.00 },
    { id: 101, name: 'Laptop X100', quantity: 1, price: 1200.00 },
    { id: 205, name: 'Mouse Óptico', quantity: 2, price: 25.00 },
    { id: 330, name: 'Licencia Software Pro', quantity: 1, price: 450.00 },
    { id: 400, name: 'Cable HDMI 4K', quantity: 3, price: 15.00 },
    { id: 512, name: 'Audífonos Gaming', quantity: 1, price: 75.00 },
    { id: 601, name: 'Teclado Mecánico', quantity: 1, price: 90.00 },
  ];

  volverInicio() {
    this.location.back();
  }
}
