export class RequestRegistroVenta {
  fechaventa: string = "";
  idcliente: number = 0;
  total: number = 0;
  detalles: DetalleVentaRequest[] = [];
}

export class DetalleVentaRequest {
  idproducto: number = 0;
  cantidad: number = 0;
  subtotal: number = 0;
}
