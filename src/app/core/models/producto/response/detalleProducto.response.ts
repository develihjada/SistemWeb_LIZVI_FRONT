import { ResponseGeneral } from "../../../../shared/model/general.response";
import { ProductoModel } from "../producto.model";

export class ResponseDetalleProductoData extends ResponseGeneral {
  producto: MapingDetalleProductos = {} as MapingDetalleProductos;
}

export class MapingDetalleProductos extends ProductoModel{
  subfamilia: string = ""
  idfamilia: number = 0
  familia: string = ""
  unidadMedida: string = ""
  marca: string = ""
}
