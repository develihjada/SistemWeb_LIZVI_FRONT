import { ResponseGeneral } from "../../../../shared/model/general.response";
import { ClienteModel } from "../cliente.models";

export class ResponseListaClientes extends ResponseGeneral{
  cliente: ClienteModel[] = [];
}
