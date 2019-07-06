import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashbordComponent} from './dashbord/dashbord.component';
import {AuthGuard} from '../core/services/auth.guard';
import {MainpageComponent} from './shared/pages/mainpage/mainpage.component';

const basePath = 'adminmainpage';

const AdminRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent,canActivate: [AuthGuard],
    children: [ { path: 'dashbord', component: DashbordComponent }]
    
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(AdminRoutes)
  ],
  exports: [RouterModule]
})
export class AddminRoutingModule { }
