import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddminRoutingModule} from './admin-routing.module';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ViewComponent } from './profile/view/view.component';
import { EditComponent } from './profile/edit/edit.component';
import { UploadSapDataComponent } from './upload-sap-data/upload-sap-data.component';
import { NewOrdersComponent } from './new-orders/new-orders.component';
import { NewOrdersViewComponent } from './new-orders-view/new-orders-view.component';
import { UpdatedOrdersComponent } from './updated-orders/updated-orders.component';
import { UpdatedOrderViewComponent } from './updated-order-view/updated-order-view.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerDetailsEditComponent } from './customer-details-edit/customer-details-edit.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {SharedModule} from './shared/shared.module';


@NgModule({
  declarations: [DashbordComponent, ViewComponent, EditComponent, UploadSapDataComponent, NewOrdersComponent, NewOrdersViewComponent, UpdatedOrdersComponent, UpdatedOrderViewComponent, DownloadsComponent, CustomerDetailsComponent, CustomerDetailsEditComponent, CreateCustomerComponent, CreateAdminComponent],
  imports: [
    CommonModule,
    AddminRoutingModule,
    SharedModule,
    RouterModule
  ]
  
})
export class AdminModule { }
