
import { HeaderComponent } from './header/header.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap'
@NgModule({
  declarations: [
    HeaderComponent,
    ResetPasswordComponent
  ],
  imports: [
  CommonModule,
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  NgbModule,
  NgbDropdownModule
  ],
  exports: [
    HeaderComponent,
    ResetPasswordComponent
  ]

})
export class RootSharedModule { }
