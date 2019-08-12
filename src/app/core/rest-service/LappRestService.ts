import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators/map';


@Injectable({
  providedIn: 'root'
})
export class LappRestService {
  _BaseUrl:string = 'http://3.17.182.133:8090/';

  constructor(private http: HttpClient) {
  }
  private static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      return of(result as T);
    };
  }




  public Get(subUrl: string, params): Observable<any> {   
    return this.http.get<any>(this._BaseUrl + subUrl, { params: params })
      .pipe(
      tap(() => { }),
      catchError(LappRestService.handleError(subUrl, []))
      );
  }

  public Post(subUrl: string, payload: any): Observable<any> {
    return this.http.post<any>(this._BaseUrl + subUrl, payload)
      .pipe(
      tap(() => { }),
      catchError(LappRestService.handleError(subUrl, []))
      );
  }
  public Put(subUrl: string, payload: any): Observable<any> {
    return this.http.put<any>(this._BaseUrl + subUrl, payload)
      .pipe(
      tap(() => { }),
      catchError(LappRestService.handleError(subUrl, []))
      );
  }
}
