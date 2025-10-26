import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaMarcasModel } from '../../models/marca/request/listaMarcas.request';
import { ResponseListaMarcas } from '../../models/marca/response/listaMarcas.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private url = environment.api;

  listaMarcas(req: RequestListaMarcasModel): Observable<ResponseListaMarcas> {
    const fullUrl = `${this.url}/Marca/Mostrar`;

    return this.http.post<ResponseListaMarcas>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
