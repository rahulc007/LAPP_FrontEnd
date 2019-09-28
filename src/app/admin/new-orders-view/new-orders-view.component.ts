import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router} from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-new-orders-view',
  templateUrl: './new-orders-view.component.html',
  styleUrls: ['./new-orders-view.component.css'],
  providers: [DatePipe]
})
export class NewOrdersViewComponent implements OnInit, AfterViewInit, AfterViewChecked  {
 
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  public data :any[]=[];
  params: any;
  array:any[]=[];
  emailId: any;
  constructor(private UserService:UserService,private http: HttpClient, private route: ActivatedRoute,
    private router:Router, private objService: LappRestService, private cdr: ChangeDetectorRef, private datePipe: DatePipe) {
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this.getUploadedOrderDetails();
  }
 getUploadedOrderDetails() {
   
   let orderId=parseInt(localStorage.getItem('oid'));
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.params = {
        "emailId": this.emailId,
        "startLimit": 0,
        "endLimit": 100 
      }
      this.objService.Get('getOrderDetailsByAdmin', this.params).subscribe(response => {
        for(let i=0; i<response.orderInfoList.length; i++) {
          if(orderId === response.orderInfoList[i].oid) {
            this.array=response.orderInfoList[i].orderLineItem
          }
        }
          this.data= this.array;
          this.data.forEach(date => {
            date.createdDate = this.datePipe.transform(date.createdDate, "medium");
            date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
          })
      })
    }
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'customerPartNo', title: 'Customer Part Number' },
      { key: 'articleNo', title: 'Article Number' },
      { key:'description', title: 'Description'},
     // { Key:'legsCount', title:'Legs Count'},
    {key:'productionOrderStatus', title:'Production Order Status'},
    {key:'productionOrderno', title:'Production Order Number'},
      // { key: 'length', title: 'Length' },
      { key: 'lineItemId', title: 'Line Item ID' },
      { key: 'lineItemno', title: 'Line Item Number' },
      // { key: 'quantity' , title:'Quantity'},
      // { key: 'updatedBy' , title:'Updated By'},
      { key:'createdDate', title:'Created Date'},
     { key:'modifiedDate', title:'Modified Date'}
    ]
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  } 
  private loadPage(page) {
    // get page of items from api
    // this.http.get<any>(`http://localhost:4000/items?page=${page }`).subscribe(x => {
    //     this.pager = x.pager;
    //     this.pageOfItems = x.pageOfItems;
    //     this.data = this.pageOfItems
    // });
  }
  goPrevious() {
    this.router.navigate(['admin/newordersview']);
  }

}
