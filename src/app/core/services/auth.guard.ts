import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let user =  JSON.parse(localStorage.getItem('currentUser'));
      let userType = '';

      if(user)
      {

      if(user['userType']=='3')
       userType = 'CUSTOMER';

       if(user['userType']=='1' || user['userType']=='2')
       userType = 'ADMIN';

      if (userType == route.data['userType']) {
            // if (route.data && route.data.restrictedToCustomer && route.data.restrictedToCustomer === true) {
            //     this.userService.sessionTimeOut();
            //     this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            //     return false;
            // }// logged in so return true
            return true;
        }
    }
        // not logged in so redirect to login page with the return url
        this.userService.sessionTimeOut();
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}

