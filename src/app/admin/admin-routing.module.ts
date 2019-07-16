import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashbordComponent} from './dashbord/dashbord.component';
import {AuthGuard} from '../core/services/auth.guard';
import {MainpageComponent} from './shared/pages/mainpage/mainpage.component';
import {UploadSapDataComponent} from './upload-sap-data/upload-sap-data.component';
import {NewOrdersComponent} from './new-orders/new-orders.component';
import {UpdatedOrdersComponent} from './updated-orders/updated-orders.component';
import { ViewComponent } from './profile/view/view.component';
import {NewOrdersViewComponent} from './new-orders-view/new-orders-view.component';
import {CustomerDetailsComponent} from './customer-details/customer-details.component';

const basePath = 'admin';

const AdminRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent,
    children: [ { path: '', redirectTo: 'dashbord',pathMatch: 'full' },{ path: 'dashbord', component: DashbordComponent },
    { path: 'upload', component: UploadSapDataComponent},
    { path: 'neworders', component: NewOrdersComponent},
    { path: 'neworders/newordersview/:id', component: NewOrdersViewComponent },
    { path: 'updatedorders', component: UpdatedOrdersComponent},
     {path: 'profile', component:ViewComponent},
     {path: 'customerdetails', component:CustomerDetailsComponent}]
    
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutes)
  ],
  exports: [RouterModule]
})
export class AddminRoutingModule { }
