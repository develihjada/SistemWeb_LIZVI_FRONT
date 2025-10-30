export class UsuarioModel {
  id: number = 0;
  nombre: string = '';
  email: string = '';
  rolId: number = 0;
  rolNombre?: string = '';
  estado: number = 1;
  fechaCreacion?: string = '';
  fechaActualizacion?: string = '';

  constructor() {}
}
