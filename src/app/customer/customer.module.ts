import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomerRoutingModule} from './customer-routing.module';

import {SharedModule} from './shared/shared.module';
import { DashbordComponent } from './dashbord/dashbord.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'ngx-easy-table';
import { HotTableModule } from '@handsontable/angular';

import {ConfigurationService} from '../common/ngx-easy-table/config-service';

import { ViewComponent } from './orders/view/view.component';
import { EditComponent } from './orders/edit/edit.component';
import { HandsontableComponent } from './orders/handsontable/handsontable.component';
import { CustomerProfileComponent } from './profile/customer-profile/customer-profile.component';
import {RootSharedModule} from '../common/root-shared.module';
import { ResetPasswordComponent } from 'src/app/common/reset-password/reset-password.component';
import { ProcessedOrdersComponent } from './processed-orders/processed-orders.component';
import { ProcessedViewComponent } from './processed-view/processed-view.component';
import {FileUploadModule, FileSelectDirective} from 'ng2-file-upload';
import { ExceluploadComponent } from './orders/excelupload/excelupload.component';

@NgModule({
  declarations: [DashbordComponent, ViewComponent, EditComponent, HandsontableComponent, CustomerProfileComponent, ProcessedOrdersComponent, ProcessedViewComponent, ExceluploadComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    TableModule,
    HotTableModule ,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    RootSharedModule,
    FileUploadModule
  ],
  exports:[],
  providers:[ConfigurationService],
  bootstrap: [DashbordComponent],
  entryComponents:[ResetPasswordComponent]
})
export class CustomerModule { }
