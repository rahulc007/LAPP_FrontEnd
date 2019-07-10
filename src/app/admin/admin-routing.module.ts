import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashbordComponent} from './dashbord/dashbord.component';
import {AuthGuard} from '../core/services/auth.guard';
import {MainpageComponent} from './shared/pages/mainpage/mainpage.component';
import {UploadSapDataComponent} from './upload-sap-data/upload-sap-data.component';
import {NewOrdersComponent} from './new-orders/new-orders.component';

const basePath = '';

const AdminRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent,canActivate: [AuthGuard],
    children: [ { path: '', redirectTo: 'dashbord',pathMatch: 'full' },{ path: 'dashbord', component: DashbordComponent },
    { path: 'upload', component: UploadSapDataComponent },
    { path: 'neworders', component: NewOrdersComponent }]
    
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutes)
  ],
  exports: [RouterModule]
})
export class AddminRoutingModule { }
