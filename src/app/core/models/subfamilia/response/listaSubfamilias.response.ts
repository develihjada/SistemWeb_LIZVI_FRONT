import { ResponseGeneral } from "../../../../shared/model/general.response";
import { SubfamiliaModel } from "../subfamilia.model";

export class ResponseListaSubfamilias extends ResponseGeneral {
  subfamilias: SubfamiliaModel[] = [];
}
