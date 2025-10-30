import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaFamiliasModel } from '../../models/familia/request/listaFamilias.request';
import { ResponseListaFamilias } from '../../models/familia/response/listaFamilias.response';
import { FamiliaModel } from '../../models/familia/familia.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasService {
  private url = environment.api;

  constructor(private http: HttpClient) {}

  /**
   * Lista las familias disponibles
   */
  listaFamilias(req: RequestListaFamiliasModel): Observable<ResponseListaFamilias> {
    const fullUrl = `${this.url}/Familia/Mostrar`;

    return this.http.post<ResponseListaFamilias>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Registra una nueva familia
   */
  registrarFamilia(familia: FamiliaModel): Observable<any> {
    const fullUrl = `${this.url}/Familia/Insertar`;

    return this.http.post<any>(fullUrl, familia, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Actualiza una familia existente
   */
  actualizarFamilia(familia: FamiliaModel): Observable<any> {
    const fullUrl = `${this.url}/Familia/Actualizar`;

    return this.http.post<any>(fullUrl, familia, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Elimina una familia
   */
  eliminarFamilia(id: number): Observable<any> {
    const fullUrl = `${this.url}/Familia/Eliminar`;

    return this.http.post<any>(fullUrl, { id }, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
