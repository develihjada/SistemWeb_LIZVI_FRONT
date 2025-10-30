import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaUsuariosModel } from '../../models/usuario/request/listaUsuarios.request';
import { RequestRegistroUsuarioModel } from '../../models/usuario/request/registroUsuario.request';
import { ResponseListaUsuarios } from '../../models/usuario/response/listaUsuarios.response';
import { UsuarioModel } from '../../models/usuario/usuario.model';
import { ResponseGeneral } from '../../../shared/model/general.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = environment.api;

  listaUsuarios(req: RequestListaUsuariosModel): Observable<ResponseListaUsuarios> {
    const fullUrl = `${this.url}/Usuario/Mostrar`;

    return this.http.post<ResponseListaUsuarios>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  registroUsuario(req: RequestRegistroUsuarioModel): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/Usuario/Registrar`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
