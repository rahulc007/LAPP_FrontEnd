import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashbordComponent} from './dashbord/dashbord.component';
import {AuthGuard} from '../core/services/auth.guard';
import {MainpageComponent} from './shared/pages/mainpage/mainpage.component';
import {ViewComponent} from './orders/view/view.component';
import {EditComponent} from './orders/edit/edit.component';
import {LegseditComponent} from './orders/legsedit/legsedit.component';
import {HandsontableComponent} from './orders/handsontable/handsontable.component';
import { CustomerProfileComponent } from './profile/customer-profile/customer-profile.component';

const basePath = 'customer';

const CustomerRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent, canActivate: [AuthGuard],
     children: [ { path: '', redirectTo: 'dashbord',pathMatch: 'full' },
     { path: 'dashbord', component: DashbordComponent },
     { path: 'dashbord/neworders', component: ViewComponent },
     { path: 'dashbord/neworders/orderedit/:id', component: EditComponent},
     { path: 'dashbord/neworders/orderedit/editlegs/:id', component: LegseditComponent},
     { path: 'dashbord/neworders/orderedit/editlegs/:id/legstable', component: HandsontableComponent},
     { path: 'dashbord/profile', component: CustomerProfileComponent}
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