import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaUnidadesMedidaModel } from '../../models/unidadMedida/request/listaUnidadesMedida.request';
import { ResponseListaUnidadesMedida } from '../../models/unidadMedida/response/listaUnidadesMedida.response';
import { UnidadMedidaModel } from '../../models/unidadMedida/unidadmedida.model';
import { ResponseGeneral } from '../../../shared/model/general.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadesMedidaService {
  private url = environment.api;

  listaUnidadesMedida(req: RequestListaUnidadesMedidaModel): Observable<ResponseListaUnidadesMedida> {
    const fullUrl = `${this.url}/UnidadMedida/Mostrar`;

    return this.http.post<ResponseListaUnidadesMedida>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  registroUnidadMedida(req: UnidadMedidaModel): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/UnidadMedida/Registrar`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }  constructor(private http: HttpClient) {}
}
