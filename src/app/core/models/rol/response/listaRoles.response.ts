import { RolModel } from '../rol.model';

export class ResponseListaRoles {
  exito: boolean = false;
  mensaje: string = '';
  roles: RolModel[] = [];
}
