import { Component, OnInit, AfterViewInit, TemplateRef, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
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
  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  public data: any[] = [];
  params: any;
  arr: any[] = [];
  array: any[]=[];
  emailId: any;
  page = 1;
  dataLength : boolean = false
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
      this.configuration = DefaultConfig;
      this.configuration.searchEnabled = true;
      this.configuration.paginationEnabled = false;
     }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
    this.loadPage(this.page);
  }
  loadPage(page) {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    let startLimit = (page-1)*10
    this.params = {
      "emailId": this.emailId,
      "startLimit": startLimit,
      "endLimit": 10
    }
      this.objService.Get('getProcessedOrderByUser',this.params).subscribe(response => {
          this.data = [];
        this.data = response.orderInfoList;
        if(this.data.length === 0) {
          this.dataLength = true;
        } else {
          this.dataLength = false
        }
        this.data.forEach(date => {
          date.createdDate = this.datePipe.transform(date.createdDate, "medium");
          date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
          date.orderDate = this.datePipe.transform(date.orderDate, "medium");
        })
      })
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
     { key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  } 

  porcessedview(row, rowIndex)
  {
    localStorage.setItem('salesOrderNo', row.salesOrderno);
    localStorage.setItem('processedorderId', row.oid);
    localStorage.setItem('processorderIndex', rowIndex);
    this.router.navigate(['customer/processedorders', row.oid]);
  }
}

