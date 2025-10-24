import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RequestListaFamiliasModel } from '../../models/familia/request/listaFamilias.request';
import { ResponseListaFamilias } from '../../models/familia/response/listaFamilias.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasService {
  private url = environment.api;

  listaFamilias(req: RequestListaFamiliasModel): Observable<ResponseListaFamilias> {
    const fullUrl = `${this.url}/Familias/Mostrar`;
    console.log('🌐 FamiliasService - Haciendo petición a:', fullUrl);
    console.log('📦 FamiliasService - Payload:', req);

    return this.http.post<ResponseListaFamilias>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
