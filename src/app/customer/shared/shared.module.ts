import { NgModule } from '@angular/core';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MainpageComponent} from './pages/mainpage/mainpage.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [MainpageComponent, FooterComponent, HeaderComponent, SidebarComponent, MainpageComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgbDropdownModule,
    ReactiveFormsModule
  ],
  exports: [
    MainpageComponent,
    NgbModule,
    NgbDropdownModule
  ]

})
export class SharedModule { }
