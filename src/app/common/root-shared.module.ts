
import { HeaderComponent } from './header/header.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HeaderComponent,
    ResetPasswordComponent,
    ForgotpasswordComponent
  ],
  imports: [
  CommonModule,
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  NgbModule,
  NgbDropdownModule,
  TranslateModule
  ],
  exports: [
    HeaderComponent,
    ResetPasswordComponent
  ]

})
export class RootSharedModule { }
