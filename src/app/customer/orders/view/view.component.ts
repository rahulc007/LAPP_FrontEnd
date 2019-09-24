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
  tempArray: any[] = [];
  emailId : any;
  productionNo: any;
  customerId: any;
  constructor(private datePipe: DatePipe, private UserService: UserService, private http: HttpClient,
    private router: Router,private route: ActivatedRoute, private objService: LappRestService,
    private cdr: ChangeDetectorRef) { this.configuration = DefaultConfig;
      this.configuration.searchEnabled = true;}

  ngOnInit() {
    // this.configuration = ConfigurationService.config;
    this.emailId = localStorage.getItem('username');
  //  this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  this.loadPage();
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'userEmailId', title: 'Email ID' },
      // { key: 'oid', title: 'Order ID' }, 
      { key: 'orderDate', title: 'Order Date' },
      // { key: 'orderStatus', title: 'Order Status' },
      { key:'salesOrderno', title:'Sales Order Number'},
      // { key: 'countryCode', title: 'Country Code' }, 
      { key: 'createdDate', title: 'Created Date' }, 
      { key: 'modifiedDate', title: 'Modified Date' }, 
      { key: 'createdBy', title: 'Created By' }, 
      { key: 'customerNo', title: 'Customer Number'},
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
    this.params = {
      "emailId": emailId,
      "startLimit": 0,
      "endLimit" :100  
    }
    this.objService.Get('getOrderDetailsByUser', this.params).subscribe(response => {
      for(let i=0; i<response.orderInfoList.length; i++) {
        if(response.orderInfoList[i].orderLineItem[0].productionOrderStatus === "Released") {
          this.arr.push(response.orderInfoList[i]);
          this.tempArray.push({
            "userEmailId": response.orderInfoList[i].userEmailId,
            "oid": response.orderInfoList[i].oid,
            "orderDate": response.orderInfoList[i].orderDate,
            "createdDate": response.orderInfoList[i].createdDate,
            "modifiedDate": response.orderInfoList[i].modifiedDate,
            "salesOrderno": response.orderInfoList[i].salesOrderno,
            "createdBy": response.orderInfoList[i].createdBy,
            "customerNo": response.orderInfoList[i].orderLineItem[0].customerNo
          })
        }
      }
      this.data = this.tempArray;
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

  search(event) {
    if (event.target.value === '') {
      this.loadPage();
    }
  }
  getPerticularSalesNo(salesOrderNo){
    this.productionNo = '';
    this.params = {
      "salesOrderno": salesOrderNo,
      "userEmailId": this.emailId,
      "createdBy":""
    }
    this.objService.Get('getOrderBySales', this.params).subscribe(response => {
      this.data = response.orderInfoList;
    })
  }
  getPerticularProductionNo(productionNo){
    this.customerId = '';
    this.params = {
      "salesOrderno": productionNo,
      "userEmailId": this.emailId,
      "createdBy":""
    }
    this.objService.Get('getOrderBySales', this.params).subscribe(response => {
      this.data = response.orderInfoList;
    })
  }
}
