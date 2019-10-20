import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';

import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core';
import { ResetPasswordComponent } from '../../common/reset-password/reset-password.component';
import {RootSharedModule} from '../../common/root-shared.module';

@NgModule({
  declarations: [
    FooterComponent,
    MainpageComponent,
 //   ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    TranslateModule.forRoot(),
    RootSharedModule
  ],
  exports: [MainpageComponent]
})
export class SharedModule { }
