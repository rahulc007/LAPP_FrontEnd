import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';;
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'lapp';
  language = environment.defaultLang;

  constructor(private translateService: TranslateService){}

  ngOnInit() {
    console.log(`LANGUAGE =${this.language}`);

    this.translateService.setDefaultLang(this.language);
    this.translateService.use(this.language);

  }
}
