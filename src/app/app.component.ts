import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';;
import {environment} from '../environments/environment';
import { NavToggleService } from '../app/common/nav-toggle-service/navtoggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'lapp';
  language = environment.defaultLang;

  constructor(private translateService: TranslateService, private navToggleService: NavToggleService){
    if(window.innerWidth<768){
      this.navToggleService.showSideBar = false;
    }
  }

  ngOnInit() {
    console.log(`LANGUAGE =${this.language}`);

    this.translateService.setDefaultLang(this.language);
    this.translateService.use(this.language);

  }


}
