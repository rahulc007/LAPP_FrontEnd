import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
//import { AppConfig } from '../../configs/app.config';
import { map } from 'rxjs/operators';
import { CookieService } from './cookieservice.service';
// import { SessionTimeOutComponent } from '../modals/session-time-out/session-time-out.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {SessionTimeOutComponent} from '../modals/session-time-out/session-time-out.component';
import {APP_CONFIG,AppConfig} from '../../configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _router: Router,public http:HttpClient,private modalService: NgbModal) { }
  isAuthenticated(): boolean {
    return localStorage.getItem('token') != null && !this.isTokenExpired();
  }

  // simulate jwt token is valid
  // https://github.com/theo4u/angular4-auth/blob/master/src/app/helpers/jwt-helper.ts
  isTokenExpired(): boolean {
    return false;
  }

    login(data) {
      //const url = `http://localhost:3000/auth/token`
      
      const url = AppConfig.endpoints.loginApi
        return this.http.post<any>(url, data)
            .pipe(map(user => {
                //login successful if there's a jwt token in the response
                if (user.status===AppConfig.ok  &&   user.statusMessage !=AppConfig.error) {
                  localStorage.setItem('userType', user.userType);
                  localStorage.setItem('token', user.token);
                   localStorage.setItem('username', user.username);
                  localStorage.setItem('currentUser',JSON.stringify(user));
                  this._router.navigate(['/dashboard']);
                 }
                 return user;
           },
           error =>{ console.log("error==>",error)
            localStorage.setItem('loginerror',error)
         }));

             
    }

    
    logout(): void {
      this.clear();
      this._router.navigate(['login']);
    }

    public sessionTimeOut() {
    //  this.modalService.open(SessionTimeOutComponent);
    }

    clear(): void {
      localStorage.clear();
    }




}
