import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
//import { AppConfig } from '../../configs/app.config';
import { map } from 'rxjs/operators';
import { CookieService } from './cookieservice.service';
//import { SessionTimeOutComponent } from '../modals/session-time-out/session-time-out.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {SessionTimeOutComponent} from '../modals/session-time-out/session-time-out.component';
import {APP_CONFIG,AppConfig} from '../../configs/app.config';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<Object>;
  public currentUser: Observable<Object>;
  private userApi: string = AppConfig.endpoints.userApi;
  constructor(private http: HttpClient, private cookieService: CookieService, private modalService: NgbModal, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<Object>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Object {
    return this.currentUserSubject.value;
  }

  public decodeUser(data: any) {

    if (!data) {
      return {};
    }
    
   
    return JSON.parse(decodeURIComponent(window.atob(data.token).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
  }


  public userAuth(data): any { 
    const url = this.userApi;
    return this.http.post<any>(url, data)
      .pipe(map(res => {
        if (res) {
          // store user details and  token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res));
          const userData = res;
         
            //const authToken = this.parseJwt(userData);
            const d = new Date(0);
            d.setUTCSeconds(userData.exp);
            this.cookieService.set('token', userData.token, d);
          
          this.currentUserSubject.next(userData);
        }
        return res;
      }));
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    const d = new Date();
    this.cookieService.set('token', '', d);
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);

  }

  public isAuth() {
    const token = this.getToken();
    if (this.currentUser && token) {
      return true;
    } else {
      return false;
    }
  }

  public getToken() {
    return this.cookieService.get('token');
  }
  public sessionTimeOut() {
    this.modalService.open(SessionTimeOutComponent);
  }

  public parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }

  getUserList() {
 

    return this.http.get('http://localhost../../../assets/data/country.json');
    
}


}
