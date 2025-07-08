import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconName } from '../shared/types/icon.types';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private cache = new Map<IconName, string>();
  private readonly basePath = 'assets/svg';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  loadIcon(name: IconName): Observable<SafeHtml> {
    if (this.cache.has(name)) {
      return of(this.sanitizer.bypassSecurityTrustHtml(this.cache.get(name)!));
    }
    console.log(`${this.basePath}/${name}.svg`)

    return this.http.get(`${this.basePath}/${name}.svg`, { responseType: 'text' })
      .pipe(
        map(svg => {
          this.cache.set(name, svg);
          return this.sanitizer.bypassSecurityTrustHtml(svg);
        }),
        catchError(() => {
          console.warn(`Ícone ${name} não encontrado`);
          return of(this.sanitizer.bypassSecurityTrustHtml(''));
        })
      );
  }

  preloadIcons(names: IconName[]): Observable<void> {
    const requests = names.map(name => this.loadIcon(name));
    return new Observable(subscriber => {
      Promise.all(requests.map(req => req.toPromise()))
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(error => subscriber.error(error));
    });
  }
}