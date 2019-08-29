import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { LoaderService } from '../../common/loader/loader.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private loaderService: LoaderService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        this.loaderService.show();
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            if (request.method == 'POST' || request.method == 'PUT' || request.method == 'DELETE')
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
        }

        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.loaderService.hide();
            }
        },
            (err) => { this.loaderService.hide() },
        ));

        // return next.handle(request)
        // .pipe(
        //   retry(1),
        //   catchError((error: HttpErrorResponse) => {

        //     let errorMessage = '';
        //     if (error.error instanceof ErrorEvent) {
        //       // client-side error
        //       errorMessage = `Error: ${error.error.message}`;
        //     } else {
        //       // server-side error
        //       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        //     }
        //     window.alert(errorMessage);
        //     return throwError(errorMessage);
        //   })
        // )
    }
}