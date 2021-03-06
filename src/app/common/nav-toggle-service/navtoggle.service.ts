import { Injectable } from '@angular/core';
import { $ } from 'protractor';


@Injectable({
  providedIn: 'root'
})

export class NavToggleService {

    showSideBar:boolean = true;
    
    toggleSideBar(){
        this.showSideBar = !this.showSideBar;
    }
}