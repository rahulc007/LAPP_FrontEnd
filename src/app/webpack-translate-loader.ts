import { TranslateLoader } from '@ngx-translate/core';
import {forkJoin, from, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/internal/operators';
import {environment} from '../environments/environment';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {

    const client = (environment as any)['client'] || 'lapp';
    console.log('Client=' + client);
    console.log('lang=' + lang);
    console.log('-----');

    const commonObservables$ = [
      from(import(`../assets/i18n/${lang}.json`)),
      from(import(`../assets/i18n/lang/${client}_${lang}.json`))
        .pipe(
          catchError(error => {
            // Ok, resource doesn't always exist
            console.log(error); return of({});
          })
        )
    ];
    return forkJoin(commonObservables$)
      .pipe(
        map( results => {
          return Object.assign( results[0].default, results[1].default || {});
        })
      );
  }
}
