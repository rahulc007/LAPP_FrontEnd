import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ConfigurationService } from './config-service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

@Component({
  selector: 'app-ngx-easy-table',
  templateUrl: './ngx-easy-table.component.html',
  styleUrls: ['./ngx-easy-table.component.css'],
  providers:[ConfigurationService]
})
export class NgxEasyTableComponent implements OnInit, AfterViewInit {
  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  public configuration: Config;
  public columns: any[] = [];
  // public columns: Columns[] = 

  public data = [{
    phone: '+1 (934) 551-2224',
    age: 20,
    address: { street: 'North street', number: 12 },
    company: 'ZILLANET',
    name: 'Valentine Webb',
    isActive: false,
  }, {
    phone: '+1 (948) 460-3627',
    age: 31,
    address: { street: 'South street', number: 12 },
    company: 'KNOWLYSIS',
    name: 'Heidi Duncan',
    isActive: true,
  }];

  // version 9.1 and below
  ngOnInit() {
    this.configuration = ConfigurationService.config;
    this.data=this.data;
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'phone', title: 'Phone' },
      { key: 'age', title: 'Age' },
      { key: 'company', title: 'Company' },
      { key: 'name', title: 'Name' },
      { key: 'isActive', title: 'STATUS' },
      {key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }
  

}
