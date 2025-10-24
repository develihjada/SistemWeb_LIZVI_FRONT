import { ResponseGeneral } from "../../../../shared/model/general.response";
import { ProductoModel } from "../producto.model";

export class ResponseListaProductos extends ResponseGeneral{
  productos: ProductoModel[] = [];
}
