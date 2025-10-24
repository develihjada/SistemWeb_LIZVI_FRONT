import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RequestRegistroVenta } from '../../models/venta/request/registroVenta.request';
import { ResponseGeneral } from '../../../shared/model/general.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private url = environment.api

  insertarVenta(req: RequestRegistroVenta): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/Vender/Insertar`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
        headers: { 'Content-Type': 'application/json' },
      });
  }

  constructor(private http: HttpClient) {}
}
