import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-processed-orders',
  templateUrl: './processed-orders.component.html',
  styleUrls: ['./processed-orders.component.css'],
  providers: [DatePipe]
})
export class ProcessedOrdersComponent implements OnInit, AfterViewInit, AfterViewChecked {
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  public data: any[] = [];
  params: any;
  arr: any[] = [];

  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) { 
      this.configuration = ConfigurationService.config;
    }

  ngOnInit() {
    this.getUploadedOrderDetails();
  }
  getUploadedOrderDetails() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    const emailId = localStorage.getItem('username');
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.objService.Get('getOrderDetailsByAdmin?emailId=' + emailId, this.params).subscribe(response => {
      
          for(let i=0; i<response.orderInfoList.length; i++) {
            if(response.orderInfoList[i].orderLineItem[0].productionOrderStatus === "Not Released") {
              console.log('status',response.orderInfoList[i].orderLineItem[0].productionOrderStatus)
              this.arr.push(response.orderInfoList[i].orderLineItem[0]);
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
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'customerPartNo', title: 'Customer Part Number'},
      { key: 'productionOrderno', title: 'Production Order Number' },
      { key:'productionOrderStatus', title:'Production Order Status'},
      { key: 'salesOrderno', title: 'Sales Order Number' },
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
    ]
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  } 
}
