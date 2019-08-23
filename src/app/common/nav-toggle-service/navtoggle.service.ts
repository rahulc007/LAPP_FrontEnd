import { Injectable } from '@angular/core';
import { $ } from 'protractor';


@Injectable({
  providedIn: 'root'
})

export class NavToggleService {

    showSideBar:boolean = true;
    screenWidth;
    
    toggleSideBar(){
      this.showSideBar = !this.showSideBar;
        this.screenWidth = window.innerWidth;
        console.log("--",this.showSideBar);
        if(this.screenWidth < 768){
          console.log("iff--",this.showSideBar);
          document.getElementById('sidebar').classList.add("active");
        } else {
          console.log("elsee--",this.showSideBar);
        }
    }
}