import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomerRoutingModule} from './customer-routing.module';

import {SharedModule} from './shared/shared.module';
import { DashbordComponent } from './dashbord/dashbord.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {ConfigurationService} from '../common/ngx-easy-table/config-service';
import { ViewComponent } from './orders/view/view.component';
import { EditComponent } from './orders/edit/edit.component';
import { TableModule } from 'ngx-easy-table';
import { LegseditComponent } from './orders/legsedit/legsedit.component';
import { HotTableModule } from '@handsontable/angular';
import { HandsontableComponent } from './orders/handsontable/handsontable.component';
import { CustomerProfileComponent } from './profile/customer-profile/customer-profile.component';


@NgModule({
  declarations: [DashbordComponent, ViewComponent, EditComponent, LegseditComponent, HandsontableComponent, CustomerProfileComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    TableModule,
    HotTableModule ,
    ReactiveFormsModule
  ],
  exports:[],
  providers:[ConfigurationService],
  bootstrap: [DashbordComponent]
})
export class CustomerModule { }
