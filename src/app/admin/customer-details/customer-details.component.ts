import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit , AfterViewInit{

  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  public data :any[]=[];
  pager = {};
  pageOfItems = [];
  baseUrl:any;

  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute) { 
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:8081/api/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }

  ngAfterViewInit() {
    this.columns = [
      { key: 'id', title: 'Customer Name' },
      { key: 'name', title: 'Customer City' },
      { key: 'name', title: 'Phone Number'},
      { key: 'name', title: 'Customer ID' },
      { key: 'name', title: 'Country' },
      { key: 'name', title: 'Email ID' },
      {key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }

  editcustomer(row)
  {
    
  }

}
