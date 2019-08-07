import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from '../../common/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from '../../common/reset-password/reset-password.component'
import {RootSharedModule} from '../../common/root-shared.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MainpageComponent,
    FooterComponent,
  //  HeaderComponent,
    SidebarComponent,
    MainpageComponent,
  // ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RootSharedModule,
    TranslateModule.forRoot()
  ],
  exports: [
    MainpageComponent 
  ]

})
export class SharedModule { }
