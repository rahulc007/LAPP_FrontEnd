import { Injectable } from '@angular/core';
import { $ } from 'protractor';


@Injectable({
  providedIn: 'root'
})

export class NavToggleService {

    showSideBar:boolean = true;
    screenWidth;
    resolutionChanged:boolean = false;
    
    toggleSideBar(){
      // if(!this.resolutionChanged && window.innerWidth<768){
      //   console.log("sidebar--",this.showSideBar);
      //   this.showSideBar = true;
      //   this.resolutionChanged = true;
      // } else {
        this.showSideBar = !this.showSideBar;
      // }



    }
}