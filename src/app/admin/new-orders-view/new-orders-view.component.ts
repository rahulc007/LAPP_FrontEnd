import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-new-orders-view',
  templateUrl: './new-orders-view.component.html',
  styleUrls: ['./new-orders-view.component.css']
})
export class NewOrdersViewComponent implements OnInit {
 

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
      { key: 'id', title: 'Line Item No' },
      { key: 'name', title: 'Article No' },
      { key: 'name', title: 'Art Design' },
      { key: 'name', title: 'Length' },
      { key: 'name', title: 'Qunatity' },
      { key: 'name', title: 'Marking Text Left' },
      { key: 'name', title: 'Marking Text Right' },

      
    ]

  }

  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:8081/api/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }


}