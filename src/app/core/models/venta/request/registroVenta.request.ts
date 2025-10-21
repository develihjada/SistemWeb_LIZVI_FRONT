export class RequestRegistroVenta {
  idCliente: number = 0;
  idVendedor: number = 0;
  productos: { id: number; cantidad: number }[] = [];
}
