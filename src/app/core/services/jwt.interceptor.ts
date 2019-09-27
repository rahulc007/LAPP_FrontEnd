import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { LoaderService } from '../../common/loader/loader.service';
import {Router} from '@angular/router';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    errorMessage: any;
    constructor(
        private loaderService: LoaderService,
        private router:Router
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
        else{
       this.router.navigate(['login']);
        }

        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.loaderService.hide();
             localStorage.removeItem('invalidApi');
            }
        },
            
            (err:Error) => {
                // alert(err.message);
                 this.errorMessage = err.message;
                 localStorage.setItem('invalidApi', this.errorMessage);
                this.loaderService.hide() },
        ));

       
    }
}