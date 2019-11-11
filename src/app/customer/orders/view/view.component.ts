import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ConfigurationService } from '../../../common/ngx-easy-table/config-service'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [ConfigurationService, DatePipe]
})
export class ViewComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('ver', { static: false }) Ver: TemplateRef<any>;

  public configuration: Config;
  public columns: any[] = [];
  data: any[] = [];
  pager = {};
  params = {};
  pageOfItems = [];
  arr: any[] = [];
  tempArray: any[] = [];
  emailId: any;
  productionNo: any;
  customerId: any;
  page = 1;
  dataLength : boolean = false;
  countryCode : any;
  constructor(private datePipe: DatePipe, private UserService: UserService, private http: HttpClient,
    private router: Router, private route: ActivatedRoute, private objService: LappRestService,
    private cdr: ChangeDetectorRef) {
      this.configuration = DefaultConfig;
      this.configuration.searchEnabled = true;
      this.configuration.paginationEnabled = false;
  }
  ngOnInit() {
    this.emailId = localStorage.getItem('username');
    this.countryCode = localStorage.getItem('countrycode');
    //  this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this.loadPage(this.page);
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'userEmailId', title: 'Email ID' },
      // { key: 'oid', title: 'Order ID' }, 
      { key: 'orderDate', title: 'Order Date' },
      // { key: 'orderStatus', title: 'Order Status' },
      { key: 'salesOrderno', title: 'Sales Order Number' },
      // { key: 'countryCode', title: 'Country Code' }, 
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key: 'createdBy', title: 'Created By' },
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'Actions', title: '', searchEnabled: false, cellTemplate: this.Ver }
    ];
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
loadPage(page) {
     let emailId = localStorage.getItem('username');
     let startLimit = (page-1)*10
    this.params = {
      "emailId": emailId,
      "startLimit":startLimit,
      "endLimit": 10
    }
    this.objService.Get('getOrderDetailsByUser', this.params).subscribe(response => {
      this.tempArray= [];
      for (let i = 0; i < response.orderInfoList.length; i++) {
        if (response.orderInfoList[i].orderLineItem[0].productionOrderStatus === "Released") {
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
      if(this.data.length === 0) {
        this.dataLength = true;
      } else {
        this.dataLength = false
      }
      this.data.forEach(date => {
        date.createdDate = this.datePipe.transform(date.createdDate, "medium");
        date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
        date.orderDate = this.datePipe.transform(date.orderDate, 'medium');
      })
    })
  }

  orderview(row, rowIndex) {
    localStorage.setItem('salesOrderNo', row.salesOrderno);
    localStorage.setItem('oid', row.oid);
    this.router.navigate(['customer/neworders', row.oid]);
  }

  search(event) {
    this.tempArray =[];
    if (event.target.value === '') {
      this.loadPage(1);
    }
  }
  getPerticularSalesNo(salesOrderNo) {
    this.productionNo = '';
    this.params = {
      "salesOrderno": salesOrderNo,
      "userEmailId": this.emailId,
      "createdBy": "",
      "countryCode":this.countryCode
    }
    this.objService.Get('getOrderBySales', this.params).subscribe(response => {
      this.data = response.orderInfoList;
    })
  }
  getPerticularProductionNo(productionNo) {
    this.customerId = '';
    this.params = {
      "productionOrderno": productionNo,
      "userEmailId": this.emailId,
      "createdBy": "",
      "countryCode":this.countryCode
    }
    this.objService.Get('getOrderByProductionOrder', this.params).subscribe(response => {
      this.data = response.orderInfoList;
    })
  }
}
