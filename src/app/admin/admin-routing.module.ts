import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AuthGuard } from '../core/services/auth.guard';
import { MainpageComponent } from './shared/pages/mainpage/mainpage.component';
import { UploadSapDataComponent } from './upload-sap-data/upload-sap-data.component';
import { NewOrdersComponent } from './new-orders/new-orders.component';
import { UpdatedOrdersComponent } from './updated-orders/updated-orders.component';
import { ViewComponent } from './profile/view/view.component';
import { NewOrdersViewComponent } from './new-orders-view/new-orders-view.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';

const basePath = 'admin';

const AdminRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent, canActivate: [AuthGuard],
    children: [{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard] },
    { path: 'upload', component: UploadSapDataComponent, canActivate: [AuthGuard] },
    { path: 'neworders', component: NewOrdersComponent, canActivate: [AuthGuard] },
    { path: 'newordersview/:id', component: NewOrdersViewComponent, canActivate: [AuthGuard] },
    { path: 'updatedorders', component: UpdatedOrdersComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ViewComponent, canActivate: [AuthGuard] },
    { path: 'customerdetails', component: CustomerDetailsComponent, data: {}, canActivate: [AuthGuard] },
    { path: 'createuser', component: CreateCustomerComponent, canActivate: [AuthGuard] }]

  },

];

@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutes)
  ],
  exports: [RouterModule]
})
export class AddminRoutingModule { }
