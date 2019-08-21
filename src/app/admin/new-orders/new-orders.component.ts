import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css'],
  providers: [DatePipe]
})
export class NewOrdersComponent implements OnInit, AfterViewInit {
  @ViewChild('ver', { static: false }) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  public data: any[] = [];
  params: any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe) {
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this.getUploadedOrderDetails();
  }
  getUploadedOrderDetails() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    const emailId = localStorage.getItem('username');
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.objService.Get('getOrderDetailsByAdmin?emailId=' + emailId, this.params).subscribe(response => {
        this.data = response.orderInfoList;
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
      { key: 'productionOrderStatus', title: 'Production Ordrer Status' },
      { key: 'productionOrderno', title: 'Production Order Number' },
      { key: 'countryCode', title: 'Country Code' },
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key: 'createdBy', title: 'Created By' },
      { key: 'Actions', title: 'View', searchEnabled: false, cellTemplate: this.Ver }
    ]
  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:4000/items?page=${page}`).subscribe(x => {
      this.pager = x.pager;
      this.pageOfItems = x.pageOfItems;
      this.data = this.pageOfItems
    });
  }

  ordersview(row, rowIndex) {
    localStorage.setItem('index', rowIndex);
    this.router.navigate(['admin/newordersview', row.oid])
  }

}
