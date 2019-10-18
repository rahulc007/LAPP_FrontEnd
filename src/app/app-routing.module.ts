import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes}  from '@angular/router';
import {LoginComponent} from './common/login/login.component';
import {AuthGuard} from '../app/core/services/auth.guard';
import { ForgotpasswordComponent} from './common/forgotpassword/forgotpassword.component';
import {PasswordUpdateComponent} from './common/password-update/password-update.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component:LoginComponent },
  { path: 'admin', loadChildren:'./admin/admin.module#AdminModule', canActivate: [AuthGuard], data:{userType:'ADMIN'} },
  { path: 'customer', loadChildren:'./customer/customer.module#CustomerModule', canActivate: [AuthGuard],  data:{userType:'CUSTOMER'} },
  { path:'login/forgotpassword', component:ForgotpasswordComponent},
  {path:'forgot-password', component:PasswordUpdateComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full'},
  
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule { }