import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AuthGuard } from '../core/services/auth.guard';
import { MainpageComponent } from './shared/pages/mainpage/mainpage.component';
import { UploadSapDataComponent } from './upload-sap-data/upload-sap-data.component';
import { NewOrdersComponent } from './new-orders/new-orders.component';

import { ViewComponent } from './profile/view/view.component';
import { NewOrdersViewComponent } from './new-orders-view/new-orders-view.component';

import { CreateCustomerComponent } from './create-customer/create-customer.component';
import {UploadStatusComponent} from './upload-status/upload-status.component';
import { ProcessedOrdersComponent } from './processed-orders/processed-orders.component';
import {ProcessedOrdersViewComponent} from './processed-orders-view/processed-orders-view.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { MarkingtextViewComponent } from './markingtext-view/markingtext-view.component';
import { MarkingtexteditComponent } from './markingtextedit/markingtextedit.component';
import { MarkingtextexceluploadComponent } from './markingtextexcelupload/markingtextexcelupload.component';

const basePath = 'admin';

const AdminRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'},
    children: [{ path: '', redirectTo: 'dashboard', pathMatch: 'full', data:{userType:'ADMIN'} },
    { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard],data:{userType:'ADMIN'} },
    { path: 'upload', component: UploadSapDataComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'} },
    { path: 'newordersview', component: NewOrdersComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'} },
    { path: 'newordersview/:id', component: NewOrdersViewComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'} },
    { path: 'newordersview/:id/editlegs',component:MarkingtexteditComponent, canActivate: [AuthGuard], data: { userType:'ADMIN'}},
    { path: 'newordersview/:id/markingtexts', component: MarkingtextViewComponent, canActivate: [AuthGuard], data: {userType:'ADMIN'}},
    { path: 'uploadmarkingtextexcel', component: MarkingtextexceluploadComponent,canActivate: [AuthGuard], data:{userType:'ADMIN'}},
    { path: 'uploadstatus', component: UploadStatusComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'} },
    { path: 'processedorders', component: ProcessedOrdersComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'}},
    { path: 'processedorders/:id', component: ProcessedOrdersViewComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'}},
    { path: 'profile', component: ViewComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'} },
    { path: 'createuser', component: CreateCustomerComponent, canActivate: [AuthGuard], data:{userType:'ADMIN'} },
    { path: 'printdata', component: DownloadsComponent, canActivate:[AuthGuard], data:{userType:'ADMIN'}}]

  },

];

@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutes)
  ],
  exports: [RouterModule]
})
export class AddminRoutingModule { }
