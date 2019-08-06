import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes}  from '@angular/router';
import {LoginComponent} from './common/login/login.component';
import {AuthGuard} from '../app/core/services/auth.guard';
import { ForgotpasswordComponent} from './common/forgotpassword/forgotpassword.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'admin', loadChildren:'./admin/admin.module#AdminModule', canActivate: [AuthGuard]  },
  { path: 'customer', loadChildren:'./customer/customer.module#CustomerModule', canActivate: [AuthGuard] },
  { path: 'login', component:LoginComponent },
  { path:'login/forgotpassword', component:ForgotpasswordComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full'},
  
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule { }