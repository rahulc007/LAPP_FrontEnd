import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
//import { ActivatedRoute } from '@angular/router';

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
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  data:any[]=[];
  // public data = [{
  //   Orders: '222',
  //   Orderdate: '10-02-2019',
  //  Orderedtime: '1:04AM',
  //  Updateddate:'02-06-2019',
  //  Updatedtime:'6:00PM'
  // }, {
  //   Orders: '333',
  //   Orderdate: '12-02-2019',
  //  Orderedtime: '3:04AM',
  //  Updateddate:'08-06-2019',
  //  Updatedtime:'5:00PM'
  // }];
  constructor(private UserService: UserService, private http: HttpClient, private router: Router,private route: ActivatedRoute) { }
  // version 9.1 and below
  ngOnInit() {
    this.configuration = ConfigurationService.config;
  //  this.data=this.data;
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'id', title: 'Orders' },
      { key: 'name', title: ' Order Date' },
      
      {key: 'Actions', title: 'Actions', searchEnabled: false,cellTemplate: this.Ver}
    ];
  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:8080/api/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }

  
  detailedlayout(row)
  {
    console.log("row===>",row)

    this.router.navigate(['customer/orderview/orderedit', row.id]);
  }

}
