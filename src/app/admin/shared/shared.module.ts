import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [FooterComponent, HeaderComponent, SidebarComponent,  MainpageComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[MainpageComponent]
})
export class SharedModule { }
