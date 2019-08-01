import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminModule} from './admin/admin.module';
import {CustomerModule} from './customer/customer.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './common/login/login.component'
import { HttpClientModule, HttpClient , HTTP_INTERCEPTORS} from '@angular/common/http';
import { FileSelectDirective } from 'ng2-file-upload';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TableModule } from 'ngx-easy-table';
import { HotTableModule } from '@handsontable/angular';
import {JwtInterceptor} from './core/services/jwt.interceptor';
import {CoreModule} from './core/core.module';
import {NgAutoCompleteModule} from 'ng-auto-complete';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
   
  ],
  imports: [
    BrowserModule,
    CoreModule,
    RouterModule,
    AdminModule,
    CustomerModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    HotTableModule.forRoot(),
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    NgAutoCompleteModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }
