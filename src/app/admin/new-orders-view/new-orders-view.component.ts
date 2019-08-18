import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router} from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';

@Component({
  selector: 'app-new-orders-view',
  templateUrl: './new-orders-view.component.html',
  styleUrls: ['./new-orders-view.component.css']
})
export class NewOrdersViewComponent implements OnInit {
 

  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  public data :any[]=[];
  params: any;
  constructor(private UserService:UserService,private http: HttpClient, private route: ActivatedRoute,
    private router:Router, private objService: LappRestService) {
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this.getUploadedOrderDetails();
  }
 getUploadedOrderDetails() {
   let i= localStorage.getItem('index');
   console.log('index',i)
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    const emailId = localStorage.getItem('username');
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.objService.Get('getOrderDetailsByAdmin?emailId=' + emailId, this.params).subscribe(response => {
          console.log("new order view response", response)
          this.data= response.orderInfoList[i].orderLineItem;
      })
    }
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'customerPartNo', title: 'Customer Part Number' },
      { key: 'articleNo', title: 'Article Number' },
      { key: 'length', title: 'Length' },
      { key: 'lineItemId', title: 'Line Item ID' },
      { key: 'lineItemno', title: 'Line Item Number' },
      { key: 'prodOrderno', title: 'Product Order Number' },
      { key: 'quantity' , title:'Quantity'},
      { key: 'updatedBy' , title:'Updated By'}
    ]

  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:4000/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }
  goPrevious() {
    this.router.navigate(['admin/neworders']);
  }

}
