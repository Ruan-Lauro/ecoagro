import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class MyApiService {
  
  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getDados(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<any>(`${this.apiUrl}/`);
    } else {
      return of([]);
    }
  }

  getItemPorId(id: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<any>(`${this.apiUrl}/dados/${id}`);
    } else {
      return of(null);
    }
  }

  criarItem(dado: {
    origem: string,
    destino: string,
    formatoDeContainers: string,
    tipoContainers: string,
    carregamento: string,
    quantidadeTEUs: number
  }): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<any>(`${this.apiUrl}/`, dado);
    } else {
      return of(null);
    }
  }

  atualizarItem(id: number, dado: any): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.put<any>(`${this.apiUrl}/dados/${id}`, dado);
    } else {
      return of(null);
    }
  }

  deletarItem(id: number): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.delete<any>(`${this.apiUrl}/dados/${id}`);
    } else {
      return of(null);
    }
  }
}