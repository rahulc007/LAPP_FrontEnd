import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AdminModule} from './admin/admin.module';
import {CustomerModule} from './customer/customer.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './common/login/login.component'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FileSelectDirective } from 'ng2-file-upload';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TableModule } from 'ngx-easy-table';
import { HotTableModule } from 'ng2-handsontable';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    
   
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AdminModule,
    CustomerModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    HotTableModule,
    AngularFontAwesomeModule
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
