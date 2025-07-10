import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyApiService {

  private apiUrl = 'http://localhost:5096/api/Co2';

  constructor(private http: HttpClient) { }

  getDados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  getItemPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dados/${id}`);
  }

  criarItem(dado: {origem: string, destino: string, formatoDeContainers: string, tipoContainers: string, carregamento: string, quantidadeTEUs:number}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, dado);
  }

  atualizarItem(id: number, dado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/dados/${id}`, dado);
  }

  deletarItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/dados/${id}`);
  }
}
