import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import {LappRestService} from '../../../core/rest-service/LappRestService';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers:[ConfigurationService]
})
export class EditComponent implements OnInit , AfterViewInit{

  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  @ViewChild('legscontent',{static: false}) legscontent: TemplateRef<any>;
  public configuration: Config;
  legsForm: FormGroup;
  umericNumberReg= '^-?[0-9]\\d*(\\.\\d{1,2})?$';
  legsnum:any;
  submitted = false;
  public columns: any[] = [];
  param={}
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  data:any[]=[];
  
  constructor(private UserService: UserService, private objService: LappRestService, private http: HttpClient,
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,  private modalService: NgbModal) { }

  ngOnInit() {
    this.configuration = ConfigurationService.config;
    this.legsForm = this.formBuilder.group({
      legsnum: ['', [Validators.required, Validators.pattern(this.numericNumberReg)]],
   });
    this.loadPage();
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'customerNo', title: 'Customer Number' },
      { key: 'customerPartNo', title: 'Customer Part Number' }, 
      { key: 'articleNo', title: 'Artical Number' }, 
      { key: 'length', title: ' Length' }, 
      { key: 'lineItemId', title: 'Line Item ID' }, 
      { key: 'lineItemno', title: 'Line Item Number' },
      { key: 'prodOrderno', title: 'Product Order Number' },
      { key: 'quantity', title: 'Quantity' },
      { key: 'updatedBy', title: 'Updated By' },
      {key: 'Actions', title: 'Edit', searchEnabled: false,cellTemplate: this.Ver}
    ];
  }

  private loadPage() {

    let i = localStorage.getItem('customerIndex');
    let emailId = localStorage.getItem('username');
    this.objService.Get('getOrderDetailsByUser?emailId='+emailId, this.param).subscribe(response => {
      this.data = response.orderInfoList[i].orderLineItem;
      
    })
  }

  
  orderview(row)
  {

    this.modalService.open(this.legscontent)
   
  }

  goPrevious() {
    this.router.navigate(['customer/neworders']);
  }

  onSubmit()
  {

    this.submitted = true;
    if (this.legsForm.invalid) {
        return;
    }

    else {
      localStorage.setItem('legsno', this.legsnum);
      console.log("legs no.:", this.legsnum);
      this.router.navigate(['customer/orderview/:id/editlegs']);
      this.modalService.dismissAll();
    }
  }
}
