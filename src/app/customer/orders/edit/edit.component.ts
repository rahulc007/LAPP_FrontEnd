import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import {LappRestService} from '../../../core/rest-service/LappRestService';
import { DatePipe } from '@angular/common';
import {userTypes} from '../../../common/constants/constants';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers:[ConfigurationService, DatePipe]
})
export class EditComponent implements OnInit , AfterViewInit, AfterViewChecked{

  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  @ViewChild('legscontent',{static: false}) legscontent: TemplateRef<any>;
  public configuration: Config;
  legseditflag=0;
  legsForm: FormGroup;
  numericNumberReg= '^-?[0-9]\\d*(\\.\\d{1,2})?$';
  legsnum:any;
  submitted = false;
  public columns: any[] = [];
  param={}
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  data:any[]=[];
  flag: any;
  mflag=0;
  array: any[]=[];

  constructor(private UserService: UserService, private objService: LappRestService, private http: HttpClient,
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private modalService: NgbModal,
    private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }

  ngOnInit() {
    this.configuration = ConfigurationService.config;
    this.legsForm = this.formBuilder.group({
      legsnum: ['', [Validators.required, Validators.pattern(this.numericNumberReg)]],
   });
    this.loadPage();
   // this.legsnum = localStorage.getItem('legsaftersave');
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
      {key: 'Actions', title: 'Edit', searchEnabled: false,cellTemplate: this.Ver}
    ];
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  } 
  private loadPage() {
    let orderId=parseInt(localStorage.getItem('oid'));

    let i = localStorage.getItem('customerIndex');
    let emailId = localStorage.getItem('username');
    this.objService.Get('getOrderDetailsByUser?emailId='+emailId, this.param).subscribe(response => {
      for(let i=0; i<response.orderInfoList.length; i++) {
        if(orderId === response.orderInfoList[i].oid) {
          this.array=response.orderInfoList[i].orderLineItem
        }
      }
      this.data= this.array;
      let dt= this.data[0].createdDate;
     
      let date1 = new Date(dt);

      date1.setDate(date1.getDate() + userTypes.markingtextExpire);

      let today = new Date();
      
     
      let diffDays = date1.getDate() - today.getDate(); 
     
     
      if(diffDays <=0 )
      {
        this.mflag=1; //model falg
      }


      this.data.forEach(date => {
        date.createdDate = this.datePipe.transform(date.createdDate, "medium");
        date.modifiedDate = this.datePipe.transform(date.modifiedDate, "medium");
      }) 

    
      this.legsnum = this.data[0].legsCount;
     
    })
  }

  
  orderview(row) {
    const lineitemId = this.data[0].lineItemId;
    const lineitemno = this.data[0].lineItemno;
    this.legsnum = this.data[0].legsCount;
    
    localStorage.setItem('lineitemid', lineitemId);
    localStorage.setItem('lineItemNo', lineitemno);
   
    this.param = {
      "lineItemid":lineitemno
    };
  
    // this.objService.Get('getMarkingText', this.param).subscribe( response => {
    
    // })

    if(this.mflag!=1)

    {
      this.legseditflag=0;
    this.modalService.open(this.legscontent)
    }
    // else{
    //   const legsCount = this.data[0].legsCount;
    //   console.log("legs count=>", legsCount)
    //   localStorage.setItem('legsno =>', legsCount);
    //   if(legsCount ==0)
    //   {
    //     this.flag=1;
    //   }
    //   else{
    //     this.flag=0;
    //   }
    //   this.router.navigate(['customer/orderview/:id/editlegs']);
    // }
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

     
     this.flag=0;
      const legsCount = this.data[0].legsCount;

      if(legsCount === 0 || legsCount === '') {
        this.flag=1;
        localStorage.setItem('legsno',  this.legsnum);
        localStorage.setItem('hflag', this.flag);
      } else {
        this.flag=0;
      localStorage.setItem('legsno', this.legsnum);
      localStorage.setItem('hflag', this.flag);
      }

      this.router.navigate(['customer/orderview/:id/editlegs']);
      this.modalService.dismissAll();
    }
  }
  
  getMatch(event) {
    const legsCount = this.data[0].legsCount;
    if(event < legsCount)
    {
      this.legseditflag = 1;
    }
    else {
      this.legseditflag = 0;
    }
  }

  closeModel()
  {
    this.legseditflag = 0;
  }
  
}
