import { ResponseGeneral } from "../../../../shared/model/general.response";
import { MarcaModel } from "../marca.model";

export class ResponseListaMarcas extends ResponseGeneral {
  marca: MarcaModel[] = [];
}