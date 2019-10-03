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
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css'],
  providers: [DatePipe,ConfigurationService]
})

export class DownloadsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('dropDown', { static: false }) DropDown: TemplateRef<any>;
  @ViewChild('download', {static: false}) DownLoad: TemplateRef<any>;
  public configuration: any
  public columns: any[] = [];
  public data: any[] = [];
  title: any;
  eventValue: any;
  errorMsg: any;
  tooltip: boolean = false;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
      this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
  }
 
  ngOnInit() {
    this.getDownloadDetails();
  }
  getDownloadDetails() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.data = [
        { oid: 1, salesOrderno: 10, orderDate: '10.Aug.2019', orderStatus:3,type: this.title},
        { oid: 2, salesOrderno: 20, orderDate: '10.Aug.2019', orderStatus: 3,type: this.title},
        { oid: 3, salesOrderno: 30, orderDate: '10.Aug.2019', orderStatus: 3, type: this.title },
        { oid: 4, salesOrderno: 40, orderDate: '10.Aug.2019', orderStatus: 3, type: this.title },
        { oid: 5, salesOrderno: 50, orderDate: '10.Aug.2019', orderStatus: 3, type: this.title },
      ];
    }
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'oid', title: 'Order ID' },
      { key: 'salesOrderno', title: 'Sales Order Number' },
      { key: 'orderDate', title: 'Order Date' },
      { key: 'orderStatus', title: 'Ordrer Status' },
      // { key: 'createdDate', title: 'Created Date' },
      // { key: 'modifiedDate', title: 'Modified Date' },
      { key: '', title: 'Options', searchEnabled: false, cellTemplate: this.DropDown  },
      { key:'', title: 'Download', searchEnabled: false, cellTemplate: this.DownLoad  }
    ]
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  selectOption(row, event,rowIndex) {
    console.log('row',row)
    console.log('event',event.target.value);
    console.log('index',rowIndex )
    this.eventValue = event.target.value;
    let index = this.data.indexOf(row) 
    this.data[rowIndex].type = event.target.value; 
  }
  downloadFile() {
    if(this.eventValue === '' || this.eventValue === null || this.eventValue === undefined) {
      this.errorMsg = "Please select any Download Options"
      console.log(this.errorMsg);
    }
    
  }
  downloadAll(event) {
    console.log(event.target.value)
    this.title = event.target.value;
  }
}
