import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddminRoutingModule} from './admin-routing.module';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ViewComponent } from './profile/view/view.component';

import { UploadSapDataComponent } from './upload-sap-data/upload-sap-data.component';
import { NewOrdersComponent } from './new-orders/new-orders.component';
import { NewOrdersViewComponent } from './new-orders-view/new-orders-view.component';


import { DownloadsComponent } from './downloads/downloads.component';


import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {FileUploadModule, FileSelectDirective} from 'ng2-file-upload';
import {NgxEasyTableComponent} from '../common/ngx-easy-table/ngx-easy-table.component';
import {PaginationComponent} from '../common/pagination/pagination.component';
import {ConfigurationService} from '../common/ngx-easy-table/config-service';
import { TableModule } from 'ngx-easy-table';
import { TranslateModule } from '@ngx-translate/core';
import { HotTableModule } from 'ng2-handsontable';
import { HttpClientModule, HttpClient , HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from '../core/services/jwt.interceptor';
import { UploadStatusComponent } from './upload-status/upload-status.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProcessedOrdersComponent } from './processed-orders/processed-orders.component';
import { ProcessedOrdersViewComponent } from './processed-orders-view/processed-orders-view.component';

@NgModule({
  declarations: [DashbordComponent, ViewComponent,  UploadSapDataComponent, NewOrdersComponent, NewOrdersViewComponent,  DownloadsComponent, CreateCustomerComponent, NgxEasyTableComponent,PaginationComponent, UploadStatusComponent, ProcessedOrdersComponent, ProcessedOrdersViewComponent,DownloadsComponent],
  imports: [
    CommonModule,
    HotTableModule,
    AddminRoutingModule,
    SharedModule,
    RouterModule,
    TranslateModule.forRoot(),
    FileUploadModule,
    FormsModule,
    TableModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
    
  ],
  exports:[NgxEasyTableComponent, PaginationComponent],
  providers:[ConfigurationService,{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}]
  
})
export class AdminModule { }
