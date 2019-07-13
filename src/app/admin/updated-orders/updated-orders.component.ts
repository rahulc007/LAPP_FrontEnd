import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';

@Component({
  selector: 'app-updated-orders',
  templateUrl: './updated-orders.component.html',
  styleUrls: ['./updated-orders.component.css']
})
export class UpdatedOrdersComponent implements OnInit , AfterViewInit{
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

  ngAfterViewInit() {
    this.columns = [
      { key: 'id', title: 'Orders' },
      { key: 'name', title: ' Order Date' },
      { key: 'name', title: ' Updated Date' },
      { key: 'name', title: ' Order Date' },
      {key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:8080/api/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }

  rowfun(item)
  {
    console.log("item==>",item)
  }

}
