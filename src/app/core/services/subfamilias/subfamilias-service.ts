import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaSubfamiliasModel } from '../../models/subfamilia/request/listaSubfamilias.request';
import { ResponseListaSubfamilias } from '../../models/subfamilia/response/listaSubfamilias.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubfamiliasService {
  private url = environment.api;

  listaSubfamilias(req: RequestListaSubfamiliasModel): Observable<ResponseListaSubfamilias> {
    const fullUrl = `${this.url}/SubFamilia/Mostrar`;

    return this.http.post<ResponseListaSubfamilias>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
