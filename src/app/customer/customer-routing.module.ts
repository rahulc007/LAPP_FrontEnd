import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashbordComponent} from './dashbord/dashbord.component';
import {AuthGuard} from '../core/services/auth.guard';
import {MainpageComponent} from './shared/pages/mainpage/mainpage.component';
import {ViewComponent} from './orders/view/view.component';
import {EditComponent} from './orders/edit/edit.component';
import {LegseditComponent} from './orders/legsedit/legsedit.component';

const basePath = 'customer';

const CustomerRoutes: Routes = [
  {
    path: basePath,
    component: MainpageComponent, canActivate: [AuthGuard],
     children: [ { path: '', redirectTo: 'dashbord',pathMatch: 'full' },
     { path: 'dashbord', component: DashbordComponent },
     { path: 'orderview', component: ViewComponent },
     { path: 'orderview/orderedit/:id', component: EditComponent},
     { path: 'orderview/orderedit/:id/editlegs', component: LegseditComponent},
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