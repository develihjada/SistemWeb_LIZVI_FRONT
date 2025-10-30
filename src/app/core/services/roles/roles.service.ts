import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaRolesModel } from '../../models/rol/request/listaRoles.request';
import { RequestRegistroRolModel } from '../../models/rol/request/registroRol.request';
import { ResponseListaRoles } from '../../models/rol/response/listaRoles.response';
import { RolModel } from '../../models/rol/rol.model';
import { ResponseGeneral } from '../../../shared/model/general.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private url = environment.api;

  listaRoles(req: RequestListaRolesModel): Observable<ResponseListaRoles> {
    const fullUrl = `${this.url}/Rol/Mostrar`;

    return this.http.post<ResponseListaRoles>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  registroRol(req: RequestRegistroRolModel): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/Rol/Registrar`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
