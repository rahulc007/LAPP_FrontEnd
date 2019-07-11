import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers:[ConfigurationService]
})
export class ViewComponent implements OnInit, AfterViewInit {
  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  public configuration: Config;
  public columns: any[] = [];
  // public columns: Columns[] = 

  public data = [{
    Orders: '222',
    Orderdate: '10-02-2019',
   Orderedtime: '1:04AM',
   Updateddate:'02-06-2019',
   Updatedtime:'6:00PM'
  }, {
    Orders: '333',
    Orderdate: '12-02-2019',
   Orderedtime: '3:04AM',
   Updateddate:'08-06-2019',
   Updatedtime:'5:00PM'
  }];
  constructor(private router: Router, private route: ActivatedRoute){}
  // version 9.1 and below
  ngOnInit() {
    this.configuration = ConfigurationService.config;
    this.data=this.data;
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'Orders', title: 'Orders' },
      { key: ' Orderdate', title: ' Order Date' },
      { key: 'Orderedtime', title: 'Ordered Time' },
      { key: 'Updateddate', title: 'Updated Date ' },
      { key: 'Updated Time', title: 'Updated Time' },
      {key: 'Actions', title: 'Actions', searchEnabled: false,cellTemplate: this.Ver}
    ];
  }
  
  detailedlayout(row)
  {
    console.log("row===>",row)

    this.router.navigate(['customer/orderview/orderedit']);
  }

}
