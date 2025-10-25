import { ResponseGeneral } from "../../../../shared/model/general.response";
import { FamiliaModel } from "../familia.model";

export class ResponseListaFamilias extends ResponseGeneral {
  familia: FamiliaModel[] = [];
}
