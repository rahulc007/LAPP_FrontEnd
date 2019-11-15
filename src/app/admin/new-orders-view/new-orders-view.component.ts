import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-orders-view',
  templateUrl: './new-orders-view.component.html',
  styleUrls: ['./new-orders-view.component.css'],
  providers: [DatePipe]
})
export class NewOrdersViewComponent implements OnInit, AfterViewInit, AfterViewChecked {
  
  @ViewChild('download', { static: false }) download: TemplateRef<any>;
  @ViewChild('view', { static: false }) view: TemplateRef<any>;
  @ViewChild('edit', {static:false}) Edit: TemplateRef<any>;
  @ViewChild('legsEdit', { static: false }) legsEdit: TemplateRef<any>;
  @ViewChild('uploadExcel',{static: false}) UploadExcel: TemplateRef<any>;

  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl: any;
  public data: any[] = [];
  params: any;
  array: any[] = [];
  emailId: any;
  salesOrderNo: any;
  lineitemId: any;
  oid: any;
  countryCode: any;
  legsForm: FormGroup;
  numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
  submitted: any;
  legsnum: any;
  lineitemno: any;
  submitFlag: any;
  viewFlag: any;
  arr: any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService, private cdr: ChangeDetectorRef, private datePipe: DatePipe,
    private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
    this.countryCode = localStorage.getItem('countrycode');
    this.salesOrderNo = localStorage.getItem('salesOrderNo');
    this.oid = localStorage.getItem('oid');
    this.getUploadedOrderDetails();
    this.legsForm = this.formBuilder.group({
      legsnum: ['', [Validators.required, Validators.pattern(this.numericNumberReg)]],
    });
  }
  getUploadedOrderDetails() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin) {
      this.params = {
        "salesOrderno": this.salesOrderNo,
        "createdBy": this.emailId,
        "userEmailId": "",
        "countryCode": this.countryCode
      }
      this.objService.Get('getOrderBySales', this.params).subscribe(response => {
        this.arr = []
       for(let i=0; i< response.orderInfoList[0].orderLineItem.length; i++) {
         if(response.orderInfoList[0].orderLineItem[i].productionOrderStatus === "Released") {
           this.arr.push(response.orderInfoList[0].orderLineItem[i])
         }
       }
       this.data= this.arr;
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
      { key: 'description', title: 'Description' },
      // { Key:'legsCount', title:'Legs Count'},
      { key: 'productionOrderStatus', title: 'Production Order Status' },
      { key: 'productionOrderno', title: 'Production Order Number' },
      // { key: 'length', title: 'Length' },
      { key: 'lineItemId', title: 'Line Item ID' },
      { key: 'lineItemno', title: 'Line Item Number' },
      // { key: 'quantity' , title:'Quantity'},
      // { key: 'updatedBy' , title:'Updated By'},
      { key: 'createdDate', title: 'Created Date' },
      { key: 'modifiedDate', title: 'Modified Date' },
      { key:'', title:'', searchEnabled: false, cellTemplate: this.view },
      { key: '', title: '', searchEnabled: false, cellTemplate: this.Edit},
      { key: '', title: '', searchEnabled: false, cellTemplate: this.UploadExcel},
      {key:'', title:'', searchEnabled: false, cellTemplate: this.download},
      
    ]
  }
  ngAfterViewChecked() {
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
  downloadData(rowdata) {
    window.location.href = this.objService._BaseUrl + 'downloadMarkingText?lineItemid='+ rowdata.lineItemId +'&salesOrderno=' + rowdata.salesOrderno + '&productionOrderno='+ rowdata.productionOrderno + '&articleno='+rowdata.articleNo;
  }
  viewMarkingTexts(row) {
    this.lineitemId = row.lineItemId;
    localStorage.setItem('lineitemid', this.lineitemId);
    this.router.navigate(['admin/newordersview/' + this.oid + '/markingtexts']);
  }
  editData(row) {
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
    if(row.legsCount === 0) {
      this.modalService.open(this.legsEdit);
    }
    else if(row.legsCount >0) {
       this.viewFlag = 0;
      localStorage.setItem('viewFlag', this.viewFlag)
      this.router.navigate(['admin/newordersview/' + this.oid + '/editlegs']);
    }

  }
  onSubmit() {
    this.submitted = true;
    if (this.legsForm.invalid) {
      return;
    }
    else {
      const legsCount = this.legsnum;;
      if (legsCount === 0 || legsCount === '') {
        localStorage.setItem('legsno', this.legsnum);
      } else {
        localStorage.setItem('legsno', this.legsnum);
      }
      this.router.navigate(['admin/newordersview/' + this.oid + '/editlegs']);
      this.modalService.dismissAll();
    }
  }
  uploadMarkupTextExcel(row) {
    this.lineitemId = row.lineItemId;
    localStorage.setItem('lineitemid', this.lineitemId);
    this.router.navigate(['admin/uploadmarkingtextexcel']);
  }
}
