
import { HeaderComponent } from './header/header.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {Router, RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    ResetPasswordComponent,
    ForgotpasswordComponent,
    PasswordUpdateComponent,
    SidebarComponent
  ],
  imports: [
  CommonModule,
 // BrowserModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  NgbModule,
  NgbDropdownModule,
  TranslateModule
  ],
  exports: [
    HeaderComponent,
    ResetPasswordComponent,
    SidebarComponent 
  ]

})
export class RootSharedModule { }
