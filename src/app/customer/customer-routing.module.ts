import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashbordComponent} from './dashbord/dashbord.component';
import {AuthGuard} from '../core/services/auth.guard';
import {MainpageComponent} from './shared/pages/mainpage/mainpage.component';
import {ViewComponent} from './orders/view/view.component';
import {EditComponent} from './orders/edit/edit.component';
import {HandsontableComponent} from './orders/handsontable/handsontable.component';
import { CustomerProfileComponent } from './profile/customer-profile/customer-profile.component';
import { ProcessedOrdersComponent } from './processed-orders/processed-orders.component';
import {ProcessedViewComponent} from './processed-view/processed-view.component';
import { ExceluploadComponent } from './orders/excelupload/excelupload.component';

const basePath = 'customer';

const CustomerRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent, canActivate: [AuthGuard], data:{userType:'CUSTOMER'},
     children: [ { path: '', redirectTo: 'dashboard',pathMatch: 'full', data:{userType:'CUSTOMER'} },
     { path: 'dashboard', component: DashbordComponent, data:{userType:'CUSTOMER'} },
     { path: 'neworders', component: ViewComponent, data:{userType:'CUSTOMER'} },
     { path: 'neworders/:id', component: EditComponent, data:{userType:'CUSTOMER'}},
    
     { path: 'neworders/:id/editlegs', component: HandsontableComponent, data:{userType:'CUSTOMER'}},
     { path: 'processedorders', component:ProcessedOrdersComponent, data:{userType:'CUSTOMER'}},
     { path: 'processedorders/:id', component:ProcessedViewComponent, data:{userType:'CUSTOMER'}},
     { path: 'uploadexcel', component: ExceluploadComponent, data:{userType:'CUSTOMER'}},
     { path: 'profile', component: CustomerProfileComponent, data:{userType:'CUSTOMER'}}
    ]
    
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(CustomerRoutes)
  ],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }