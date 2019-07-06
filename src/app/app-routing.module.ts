import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes}  from '@angular/router';

import {MainpageComponent} from './admin/shared/pages/mainpage/mainpage.component';
import {LoginComponent} from './common/login/login.component';
//import {AdminmainComponent} from './lappmodule/admin-module/admin-shared/admin-pages/adminmain/adminmain.component'
import {AuthGuard} from '../app/core/services/auth.guard';

//import {MainpageComponent} from './shared/pages/mainpage/mainpage.component'


const routes: Routes = [
  { path: '', component:LoginComponent },
  { path: 'adminmainpage', component:MainpageComponent,canActivate: [AuthGuard]  },
  { path: 'login', component:LoginComponent },
  
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule { }