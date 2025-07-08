// src/app/services/template-loader.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TemplateLoaderService {
  constructor(private http: HttpClient) {}

  loadTemplate(templateName: string): Observable<{ html: string; css: string }> {
    const html$ = this.http.get(`assets/pdf-templates/${templateName}.html`, { responseType: 'text' });
    const css$ = this.http.get(`assets/pdf-templates/${templateName}.css`, { responseType: 'text' }).pipe(
      catchError(() => of('')) 
    );

    return forkJoin([html$, css$]).pipe(
      map(([html, css]) => ({ html, css }))
    );
  }
}