import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css']
})
export class NewOrdersComponent implements OnInit , AfterViewInit{
  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  public data :any[]=[];
 
  constructor(private UserService:UserService,private http: HttpClient, private route: ActivatedRoute,private router:Router) {this.configuration = ConfigurationService.config; 
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
   
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1))

  }
  
  ngAfterViewInit() {
    this.columns = [
      { key: 'id', title: 'User ID' },
      { key: 'name', title: 'Order No' },
      { key: 'name', title: 'Ordered Date' },
      { key: 'name', title: 'Updated Date' },
      {key: 'Actions', title: 'View', searchEnabled: false, cellTemplate: this.Ver}
    ]

  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:4000/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }

  ordersview(row)
  {
    console.log("row===>",row);
    this.router.navigate(["admin/neworders/newordersview", row.id])
  }

}
