import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css'],
  providers: [DatePipe]
})
export class NewOrdersComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('ver', { static: false }) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  public data: any[] = [];
  params: any;
  arr: any[] = [];
  emailId : any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    // this.configuration = ConfigurationService.config;
    this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this.emailId = localStorage.getItem('username');
    this.getUploadedOrderDetails();
    
  }
  getUploadedOrderDetails() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    // const emailId = localStorage.getItem('username');
   
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.params = {
        "emailId": this.emailId,
        "startLimit": 0,
        "endLimit": 100 
      }
      this.objService.Get('getOrderDetailsByAdmin', this.params).subscribe(response => {
      
          for(let i=0; i<response.orderInfoList.length; i++) {
            if(response.orderInfoList[i].orderLineItem[0].productionOrderStatus === "Released") {
              this.arr.push(response.orderInfoList[i]);
            }
          }
        this.data = this.arr;
        this.data.forEach(date => {
          date.createdDate = this.datePipe.transform(date.createdDate, "medium");
          date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
          date.orderDate = this.datePipe.transform(date.orderDate, "medium");
        })
      })
    }
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'userEmailId', title: 'User Email ID' },
      { key: 'oid', title: 'Order ID' },
      { key: 'orderDate', title: 'Order Date' },
      // { key: 'orderStatus', title: 'Ordrer Status' },
      { key: 'salesOrderno', title: 'Sales Order Number' },
      // { key: 'countryCode', title: 'Country Code' },
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key: 'createdBy', title: 'Created By' },
      { key: 'Actions', title: 'View', searchEnabled: false, cellTemplate: this.Ver }
    ]
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  } 
  private loadPage(page) {
    // get page of items from api
    // this.http.get<any>(`http://localhost:4000/items?page=${page}`).subscribe(x => {
    //   this.pager = x.pager;
    //   this.pageOfItems = x.pageOfItems;
    //   this.data = this.pageOfItems
    // });
  }

  ordersview(row, rowIndex) {
    console.log('id',row.oid)
    localStorage.setItem('oid', row.oid)
    localStorage.setItem('index', rowIndex);
    this.router.navigate(['admin/newordersview', row.oid])
  }

  search(event) {
    if (event.target.value === '') {
      this.getUploadedOrderDetails();
    }
  }
  getPerticularSalesNo(salesOrderNo) {
    this.params = {
      "salesOrderno": salesOrderNo,
      "createdBy": this.emailId,
      "userEmailId": ""
    }
    this.objService.Get('getOrderBySales', this.params).subscribe(response =>{
      console.log('response', response)
     this.data = response.orderInfoList;
    })
  }
  getPerticularProductionNo(productionOrderNo) {
    this.params = {
      "productionOrderno": productionOrderNo,
      "createdBy": this.emailId,
      "userEmailId": ""
    }
    this.objService.Get('getOrderByProductionOrder', this.params).subscribe(response =>{
      console.log('response', response)
     this.data = response.orderInfoList;
    })
  }
}
