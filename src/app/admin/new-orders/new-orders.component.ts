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
  @ViewChild('download', { static: false }) download: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  public data: any[] = [];
  pager: any = {};
  params: any;
  arr: any[] = [];
  emailId: any;
  customerId: any;
  productionNo: any;
  myOrderCount: any;
  startDate: any;
  toDate: any;
  dates: any;
  showBackBtn = false;
  countryCode: any;
  isAdmin: boolean;
  dataLength: boolean = false;
  flag = 1;
  page = 1;
  serachError: any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
    this.configuration.paginationEnabled = false;
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType == userTypes.admin) {
      this.isAdmin = true;
    }
  }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
    this.countryCode = localStorage.getItem('countrycode');
    this.getMyordersCount();
    this.loadPage(1);
  }

  loadPage(page) { 
    this.flag = 1;
    let startLimit = (page - 1) * 10
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.params = {
        "countryCode": this.countryCode,
        "startLimit": startLimit,
        "endLimit": 10
      }
      this.objService.Get('getOrderDetailsByAdmin', this.params).subscribe(response => {
        this.data = response.orderInfoList;
       if(this.data.length === 0) {
          this.dataLength = true;
        } else {
          this.dataLength = false;
        }
        this.data.forEach(date => {
          date.createdDate = this.datePipe.transform(date.createdDate, "medium");
          date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
          date.orderDate = this.datePipe.transform(date.orderDate, "medium");
        });
       
      })
    }
  }
  ngAfterViewInit() {
    this.columns = [
      // { key: 'oid', title: 'Order ID' },
      { key: 'orderDate', title: 'Order Date' },
      { key: 'userEmailId', title: 'User Email ID' },
      // { key: 'orderStatus', title: 'Ordrer Status' },
      { key: 'salesOrderno', title: 'Sales Order Number' },
      // { key: 'countryCode', title: 'Country Code' },
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key: 'createdBy', title: 'Created By' },
      { key: 'Actions', title: 'View', searchEnabled: false, cellTemplate: this.Ver },
      { key: 'download', title: 'Download by Sales Order No', searchEnabled: false, cellTemplate: this.download }
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
      this.configuration.paginationEnabled = false;
    }
  }
  getPerticularSalesNo(salesOrderNo) {
    this.productionNo = '';
    this.params = {
      "salesOrderno": salesOrderNo,
      "createdBy": this.emailId,
      "userEmailId": "",
      "countryCode": this.countryCode
    }
    this.objService.Get('getOrderBySales', this.params).subscribe(response => {
     
      if(response.orderInfoList.length !== 0) {
        this.arr = []
        for(let i=0; i< response.orderInfoList[0].orderLineItem.length; i++) {
          if(response.orderInfoList[0].orderLineItem[i].productionOrderStatus === "Released" || response.orderInfoList[0].orderLineItem[i].productionOrderStatus === "Rel" || response.orderInfoList[0].orderLineItem[i].productionOrderStatus === "REL" || response.orderInfoList[0].orderLineItem[i].productionOrderStatus === "") {
            this.arr = response.orderInfoList;
          }
        }
        this.data = this.arr;
        this.data.forEach(date => {
          date.createdDate = this.datePipe.transform(date.createdDate, "medium");
          date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
          date.orderDate = this.datePipe.transform(date.orderDate, "medium");
        });
        this.serachError = '';
      }
      else {
        this.data = this.arr;
        this.serachError = '';
      }
    })
  }
  getPerticularProductionNo(productionOrderNo) {
    this.customerId = '';
    this.params = {
      "productionOrderno": productionOrderNo,
      "createdBy": this.emailId,
      "userEmailId": "",
      "countryCode": this.countryCode
    }
    this.objService.Get('getOrderByProductionOrder', this.params).subscribe(response => {
      this.data = response.orderInfoList;
    })
  }
  downloadSales(row) {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      window.location.href = this.objService._BaseUrl + 'orderDownloadText?salesOrderno=' + row.salesOrderno;
    }
  }
  getMyordersCount() {
    this.params = {
      'countryCode': this.countryCode
    }
    this.objService.Get('gerOrderDataCount', this.params).subscribe(response => {
      this.myOrderCount = response.myOrderCount;
    })
  }
  getOrdersByRange(dates, page) {
    this.flag = 0;
    let startLimit = (this.page -1) * 10
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.admin || objUserDetails.userType === userTypes.superAdmin ) {
    this.showBackBtn = true;
    this.startDate = this.datePipe.transform(dates[0], "yyyy-MM-dd");
    let ToDate = dates[1];
    let reqDate = new Date(ToDate);
    let testDate = reqDate.setDate(reqDate.getDate() + 1);
    this.toDate = this.datePipe.transform(testDate, "yyyy-MM-dd");
    this.params = {
      'countryCode': this.countryCode,
      'emailId': this.emailId,
      'startDate': this.startDate,
      'endDate': this.toDate,
      'startLimit': startLimit,
      'endLimit': 10,
      'tabType': 1
    }
    this.objService.Get('getOrderDetailsByDate', this.params).subscribe(response => {
      this.data = response.orderInfoList;
      if(this.data.length === 0) {
        this.dataLength = true;
      } else {
        this.dataLength = false;
      }
      this.data.forEach(date => {
        date.createdDate = this.datePipe.transform(date.createdDate, "medium");
        date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
        date.orderDate = this.datePipe.transform(date.orderDate, "medium");
      });
    });
  }
  }
  goBack() {
    this.loadPage(1);
    this.dates = '';
    this.showBackBtn = false;
  }
   keyDownFunction(event) {
      if (event.keyCode == 13) {
        if(event.target.value === '') {
          this.serachError = "Please Enter Sales Order No";
        } else { 
        this.getPerticularSalesNo(event.target.value);
        this.serachError = '';
      }
     }  
  }
}
