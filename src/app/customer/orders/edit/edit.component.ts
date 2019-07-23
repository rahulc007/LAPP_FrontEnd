import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../../common/ngx-easy-table/config-service'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers:[ConfigurationService]
})
export class EditComponent implements OnInit , AfterViewInit{

  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  public configuration: Config;
  public columns: any[] = [];
  // public columns: Columns[] = 
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  data:any[]=[];
  
  constructor(private UserService: UserService, private http: HttpClient, private router: Router,private route: ActivatedRoute) { }
  // version 9.1 and below
  ngOnInit() {
    this.configuration = ConfigurationService.config;
  //  this.data=this.data;
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }
  ngAfterViewInit() {
    this.columns = [
      { key: 'id', title: 'Line Item No' },
      { key: 'name', title: 'Article Number' }, 
      { key: 'name', title: ' Art Designation' }, 
      { key: 'name', title: ' Length' }, 
      { key: 'name', title: ' Quantity' }, 
      {key: 'Actions', title: 'Edit', searchEnabled: false,cellTemplate: this.Ver}
    ];
  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:4000/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }

  
  orderview(row)
  {
    console.log("row===>",row)
    this.router.navigate(['customer/orderview/orderedit/editlegs',row.id]);
  }
}
