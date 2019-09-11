import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import {LappRestService} from '../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
import {userTypes} from '../../common/constants/constants';

@Component({
  selector: 'app-processed-orders-view',
  templateUrl: './processed-orders-view.component.html',
  styleUrls: ['./processed-orders-view.component.css']
})
export class ProcessedOrdersViewComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public columns: any[] = [];
  data:any[]=[];
  public configuration: Config;
  array: any[]=[];

  constructor(private UserService: UserService, private objService: LappRestService, private http: HttpClient,
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private modalService: NgbModal,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.configuration = ConfigurationService.config;
    this.loadPage();
  }

  ngAfterViewInit() {
    this.columns = [
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'customerPartNo', title: 'Customer Part Number' }, 
      { key: 'articleNo', title: 'Article Number' }, 
      { key:'description', title:'Description'},
      // { key: 'length', title: ' Length' }, 
      { key: 'lineItemId', title: 'Line Item ID' }, 
      { key: 'lineItemno', title: 'Line Item Number' },
      { key:'productionOrderStatus', title:'Production Order Status'},
      { key:'productionOrderno', title:'Production Order Number'},
   //   { key: 'prodOrderno', title: 'Product Order Number' },
      // { key: 'quantity', title: 'Quantity' },
      // { key: 'updatedBy', title: 'Updated By' },
      { key:'createdDate', title:'Created Date'},
      { key:'modifiedDate', title:'Modified Date'},
     
    ];
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  loadPage()
  {
    let pId=parseInt(localStorage.getItem('processedorderId'));
    let i = localStorage.getItem('customerIndex');
    let emailId = localStorage.getItem('username');

    let params={
     "emailId":emailId
    }

    this.objService.Get('getProcessedOrderByAdmin' , params).subscribe(response => {
      for(let i=0; i<response.orderInfoList.length; i++) {
        if(pId=== response.orderInfoList[i].oid) {
          this.array=response.orderInfoList[i].orderLineItem
        }
      }
      this.data = this.array;
     
    })

  }

  goPrevious()
  {
    this.router.navigate(['admin/processedorders']);
  }

}
