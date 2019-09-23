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
  selector: 'app-processed-orders',
  templateUrl: './processed-orders.component.html',
  styleUrls: ['./processed-orders.component.css'],
  providers: [DatePipe]
})
export class ProcessedOrdersComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('ver', { static: false }) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  public data: any[] = [];
  params: any;
  arr: any[] = [];
  emailId: any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
  }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
    this.getUploadedOrderDetails();
  }
  getUploadedOrderDetails() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    this.params = {
      "emailId": this.emailId,
      "startLimit": 0,
      "endLimit": 100
    }
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.objService.Get('getProcessedOrderByAdmin',this.params).subscribe(response => {
        this.data = response.orderInfoList;
        this.data.forEach(date => {
          date.createdDate = this.datePipe.transform(date.createdDate, "medium");
          date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
        })
      })
    }
  }
  ngAfterViewInit() {
    // this.columns = [
    //   { key: 'customerNo', title: 'Customer Number' },
    //   { key: 'customerPartNo', title: 'Customer Part Number'},
    //   { key: 'productionOrderno', title: 'Production Order Number' },
    //   { key:'productionOrderStatus', title:'Production Order Status'},
    //   { key: 'salesOrderno', title: 'Sales Order Number' },
    //   { key: 'createdDate', title: 'Created Date' },
    //   { key: 'modifiedDate', title: 'Modified Date' },
    // ]

    this.columns = [
      { key: 'userEmailId', title: 'User Email ID' },
      // { key: 'oid', title: 'Order ID' }, 
      { key: 'orderDate', title: 'Order Date' },
      // { key: 'orderStatus', title: 'Order Status' },
      { key: 'salesOrderno', title: 'Sales Order Number' },
      // { key: 'countryCode', title: 'Country Code' }, 
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key: 'createdBy', title: 'Created By' },
      { key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver }
    ];


  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  porcessedOrder(row, rowIndex) {
    localStorage.setItem('processedorderId', row.oid);
    localStorage.setItem('processorderIndex', rowIndex);
    this.router.navigate(['admin/processedview', row.oid]);
  }
}
