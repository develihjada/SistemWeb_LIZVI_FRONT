import { ResponseGeneral } from "../../../../shared/model/general.response";
import { UnidadMedidaModel } from "../unidadmedida.model";

export class ResponseListaUnidadesMedida extends ResponseGeneral {
  unidadesMedida: UnidadMedidaModel[] = [];
}
