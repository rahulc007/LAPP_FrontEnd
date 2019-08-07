import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class NavToggleService {

    showSideBar:boolean = true;
    
    toggleSideBar(){
        this.showSideBar = !this.showSideBar;
        
    }
}