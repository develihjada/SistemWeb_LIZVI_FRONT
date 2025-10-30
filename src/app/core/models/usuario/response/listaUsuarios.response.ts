import { UsuarioModel } from '../usuario.model';

export class ResponseListaUsuarios {
  exito: boolean = false;
  mensaje: string = '';
  usuario: UsuarioModel[] = [];

  constructor() {}
}
