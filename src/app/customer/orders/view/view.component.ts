import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import {LappRestService} from '../../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
//import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers:[ConfigurationService, DatePipe]
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
  
  constructor(private datePipe: DatePipe,private UserService: UserService, private http: HttpClient, private router: Router,private route: ActivatedRoute, private objService: LappRestService) { }
  // version 9.1 and below
  ngOnInit() {
    this.configuration = ConfigurationService.config;
  //  this.data=this.data;
  //  this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  this.loadPage();
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'userEmailId', title: 'User Email ID' },
      { key: 'oid', title: 'Order ID' }, 
      { key: 'orderDate', title: 'Order Date' }, 
      { key: 'productionOrderStatus', title: 'Production Order Status' }, 
      { key: 'productionOrderno', title: 'Production Order Number' }, 
      { key: 'countryCode', title: 'Country Code' }, 
      { key: 'createdDate', title: 'Created Date' }, 
      { key: 'modifiedDate', title: 'Modified Date' }, 
      { key: 'createdBy', title: 'Created By' }, 
      
      { key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }

  private loadPage() {
    // get page of items from api
    // this.http.get<any>(`http://localhost:4000/items?page=${page }`).subscribe(x => {
    //     this.pager = x.pager;
    //     this.pageOfItems = x.pageOfItems;
    //     this.data = this.pageOfItems
    // });

    let emailId = localStorage.getItem('username');

    this.objService.Get('getOrderDetailsByUser?emailId='+emailId, this.param).subscribe(response => {
      this.data = response.orderInfoList;
      this.data.forEach(date => {
        date.createdDate = this.datePipe.transform(date.createdDate, "medium");
        date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium")
      })
      
    })

  }

  
  orderview(row, rowIndex)
  {
    console.log("row===>",row)
    localStorage.setItem('customerIndex', rowIndex);
    this.router.navigate(['customer/orderedit', row.oid]);
  }

  

}
