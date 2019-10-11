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
  public data: any[] = [];
  pager: any = {};
  params: any;
  arr: any[] = [];
  emailId: any;
  customerId: any;
  productionNo: any;

  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
    this.configuration.paginationEnabled = false;
  }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
     this.loadPage(1);
  }

  loadPage(page) {
    let startLimit = (page-1)*10
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.params = {
        "emailId": this.emailId,
        "startLimit": startLimit,
        "endLimit": 9
      }
      this.objService.Get('getOrderDetailsByAdmin', this.params).subscribe(response => {
        this.arr=[]
        for (let i = 0; i < response.orderInfoList.length; i++) {
          if (response.orderInfoList[i].orderLineItem[0].productionOrderStatus === "Released") {
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
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ordersview(row, rowIndex) {
    localStorage.setItem('salesOrderNo', row.salesOrderno)
    localStorage.setItem('oid', row.oid);
    this.router.navigate(['admin/newordersview', row.oid]);
  }

  search(event) {
    this.arr = []
    if (event.target.value === '') {
      this.loadPage(1);
    }
  }
  getPerticularSalesNo(salesOrderNo) {
    this.productionNo = '';
    this.params = {
      "salesOrderno": salesOrderNo,
      "createdBy": this.emailId,
      "userEmailId": ""
    }
    this.objService.Get('getOrderBySales', this.params).subscribe(response => {
      console.log('response', response)
      this.data = response.orderInfoList;
    })
  }
  getPerticularProductionNo(productionOrderNo) {
    this.customerId = '';
    this.params = {
      "productionOrderno": productionOrderNo,
      "createdBy": this.emailId,
      "userEmailId": ""
    }
    this.objService.Get('getOrderByProductionOrder', this.params).subscribe(response => {
      console.log('response', response)
      this.data = response.orderInfoList;
    })
  }
}
