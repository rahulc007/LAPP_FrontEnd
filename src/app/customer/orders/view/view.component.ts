import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import {LappRestService} from '../../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers:[ConfigurationService, DatePipe]
})
export class ViewComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  public configuration: Config;
  public columns: any[] = [];
  
  pager = {};
  params={};
  pageOfItems = [];
  baseUrl:any;
  data:any[]=[];
  arr: any[] = [];
  constructor(private datePipe: DatePipe, private UserService: UserService, private http: HttpClient,
    private router: Router,private route: ActivatedRoute, private objService: LappRestService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.configuration = ConfigurationService.config;
  //  this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  this.loadPage();
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'userEmailId', title: 'User Email ID' },
      { key: 'oid', title: 'Order ID' }, 
      { key: 'orderDate', title: 'Order Date' },
      { key: 'orderStatus', title: 'Order Status' },
      { key:'salesOrderno', title:'Sales Order Number'},
      { key: 'countryCode', title: 'Country Code' }, 
      { key: 'createdDate', title: 'Created Date' }, 
      { key: 'modifiedDate', title: 'Modified Date' }, 
      { key: 'createdBy', title: 'Created By' }, 
      { key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }
  private loadPage() {
    // get page of items from api
    // this.http.get<any>(`http://localhost:4000/items?page=${page }`).subscribe(x => {
    //     this.pager = x.pager;
    //     this.pageOfItems = x.pageOfItems;
    //     this.data = this.pageOfItems
    // });

    let emailId = localStorage.getItem('username');
    this.objService.Get('getOrderDetailsByUser?emailId='+emailId, this.params).subscribe(response => {
      for(let i=0; i<response.orderInfoList.length; i++) {
        if(response.orderInfoList[i].orderLineItem[0].productionOrderStatus === "Released") {
          this.arr.push(response.orderInfoList[i]);
        }
      }
      this.data = this.arr;
      this.data.forEach(date => {
        date.createdDate = this.datePipe.transform(date.createdDate, "medium");
        date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
        date.orderDate = this.datePipe.transform(date.orderDate, 'medium');
      }) 
    })
  }
  
  orderview(row, rowIndex) {
    localStorage.setItem('oid', row.oid);
    localStorage.setItem('customerIndex', rowIndex);
    this.router.navigate(['customer/orderview', row.oid]);
  }

}
