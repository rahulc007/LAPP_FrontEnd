import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ConfigurationService } from '../../../common/ngx-easy-table/config-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
import { userTypes } from '../../../common/constants/constants';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ConfigurationService, DatePipe]
})
export class EditComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('ver', { static: false }) Ver: TemplateRef<any>;
  @ViewChild('uploadExcel', { static: false }) uplodExl: TemplateRef<any>;
  @ViewChild('legscontent', { static: false }) legscontent: TemplateRef<any>;
  @ViewChild('view', { static: false}) view: TemplateRef<any>;
  public configuration: Config;
  legseditflag = 0;
  legsForm: FormGroup;
  numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
  legsnum: any;
  submitted = false;
  public columns: any[] = [];
  params = {};
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  data: any[] = [];
  flag: any;
  mflag = 0;
  array: any[] = [];
  salesOrderNo: any;
  buttonFlag: any;
  lineitemId: any;
  lineitemno: any;
  emailId: any;
  oid: any;
  submitFlag: any;
  error: any;
  viewFlag: any;
  countryCode: any;
  arr: any;
  constructor(private UserService: UserService, private objService: LappRestService, private http: HttpClient,
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private modalService: NgbModal,
    private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }

  ngOnInit() {
    this.configuration = ConfigurationService.config;
    this.legsForm = this.formBuilder.group({
      legsnum: ['', [Validators.required, Validators.pattern(this.numericNumberReg)]],
    });
    this.emailId = localStorage.getItem('username');
    this.countryCode = localStorage.getItem('countrycode')
    this.salesOrderNo = localStorage.getItem('salesOrderNo');
    this.oid = localStorage.getItem('oid');
    this.loadPage();
  }
  ngAfterViewInit() {
    this.columns = [
      // { key: 'lineItemId', title: 'Line Item ID' },
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'customerPartNo', title: 'Customer Part Number' },
      { key: 'articleNo', title: 'Article Number' },
      { key: 'description', title: 'Description' },
      // { key: 'length', title: ' Length' }, 
      { key: 'lineItemno', title: 'Line Item Number' },
      { key: 'productionOrderStatus', title: 'Production Order Status' },
      { key: 'productionOrderno', title: 'Production Order Number' },
      //   { key: 'prodOrderno', title: 'Product Order Number' },
      // { key: 'quantity', title: 'Quantity' },
      // { key: 'updatedBy', title: 'Updated By' },
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key:'view', title:'', searchEnabled: false, cellTemplate: this.view},
      { key: 'Actions', title: '', searchEnabled: false, cellTemplate: this.Ver },
      { key: 'Upload', title: '', searchEnabled: false, cellTemplate: this.uplodExl }

    ];
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadPage() {
    // this.params = {
    //   "salesOrderno": this.salesOrderNo,
    //   "userEmailId": this.emailId,
    //   "createdBy": "",
    //   "countryCode": this.countryCode
    // }
    this.params = {
      "salesOrderno": this.salesOrderNo
    }
    this.objService.Get('getLineItemByUser', this.params).subscribe(response => {
      // this.arr = []
      //  for(let i=0; i< response.orderInfoList[0].orderLineItem.length; i++) {
      //    if(response.orderInfoList[0].orderLineItem[i].productionOrderStatus === "Released") {
      //      this.arr.push(response.orderInfoList[0].orderLineItem[i])
      //    }
      //  }
      //  this.data= this.arr;
      // this.data = response.orderInfoList[0].orderLineItem;
      this.data = response.orderLineItemList;
      this.data.forEach(date => {
        date.createdDate = this.datePipe.transform(date.createdDate, "medium");
        date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
      })
     
      let dt = this.data[0].createdDate;
      let date1 = new Date(dt);
      let sdate: any = date1;
      date1.setDate(date1.getDate() + userTypes.markingtextExpire);
      let exdate: any = date1;
      let today = new Date();
      let difDate: any = date1.getTime() - today.getTime();
      difDate = difDate / (1000 * 3600 * 24);
      let diffDays = Math.floor(difDate);
      if (diffDays <= 0) {
        this.mflag = 1; //model falg
      }
    })
  }

  orderview(row) {
    this.lineitemId = row.lineItemId;
    this.lineitemno = row.lineItemno;
    this.legsnum = row.legsCount;
    localStorage.setItem('lineitemid', this.lineitemId);
    localStorage.setItem('lineItemNo', this.lineitemno);
    localStorage.setItem('legsno', this.legsnum);
    if (row.submit === true) {
      this.submitFlag = 0
      localStorage.setItem('submitflag', this.submitFlag);
    }
    else {
      this.submitFlag = 1
      localStorage.setItem('submitflag', this.submitFlag);
    }

    if (this.legsnum > 0 && this.mflag !== 1) {
      this.viewFlag = 0;
      localStorage.setItem('viewFlag', this.viewFlag)
      this.router.navigate(['customer/neworders/' + this.oid + '/editlegs']);
    }
    else if (this.mflag != 1) {
      this.viewFlag = 0;
      localStorage.setItem('viewFlag', this.viewFlag)
      this.modalService.open(this.legscontent)
    }
    else if(this.mflag === 1) {
      this.error = "Time Period Expired, Cannot Edit the Legs";
      setTimeout(() => {
        this.error = '';
      }, 2000);
    }
  }

  goPrevious() {
    this.router.navigate(['customer/neworders']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.legsForm.invalid) {
      return;
    }
    else {
      this.flag = 0;
      const legsCount = this.legsnum;;
      if (legsCount === 0 || legsCount === '') {
        this.flag = 1;
        localStorage.setItem('legsno', this.legsnum);
      } else {
        this.flag = 0;
        localStorage.setItem('legsno', this.legsnum);
      }
      this.router.navigate(['customer/neworders/' + this.oid + '/editlegs']);
      this.modalService.dismissAll();
    }
  }

  // getMatch(event) {
  //   const legsCount = this.data[0].legsCount;
  //   if (event < legsCount) {
  //     this.legseditflag = 1;
  //   }
  //   else {
  //     this.legseditflag = 0;
  //   }
  // }

  // closeModel() {
  //   this.legseditflag = 0;
  // }

  uploadMarkupTextExl(row) {
    this.lineitemId = row.lineItemId;
    localStorage.setItem('lineitemid', this.lineitemId);
    if (this.mflag != 1) {
      this.router.navigate(['customer/uploadexcel']);
    }
    else {
        this.error = "Time Period Expired, Cannot Upload Excel file";
        setTimeout(() => {
          this.error = '';
        }, 2000);
    }
  }
  viewOrders(row) {
    this.lineitemId = row.lineItemId;
    localStorage.setItem('lineitemid', this.lineitemId);
    this.viewFlag = 1;
    localStorage.setItem('viewFlag', this.viewFlag)
    this.router.navigate(['customer/neworders/' + this.oid + '/editlegs']);
  }

}
