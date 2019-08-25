import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked  } from '@angular/core';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import * as XLSX from 'xlsx';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { userTypes } from '../../common/constants/constants';
@Component({
  selector: 'app-updated-orders',
  templateUrl: './updated-orders.component.html',
  styleUrls: ['./updated-orders.component.css']
})
export class UpdatedOrdersComponent implements OnInit , AfterViewInit,AfterViewChecked{
  @ViewChild('ver',{static: false}) Ver: TemplateRef<any>;
  configuration: any;
  public columns: any[] = [];
  public data :any[]=[];
  pager = {};
  pageOfItems = [];
  baseUrl:any;
  params: any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private cdr: ChangeDetectorRef, private objService: LappRestService) { 
    this.configuration = ConfigurationService.config;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this. getOrderStatusByUser();
  }

  ngAfterViewInit() {
    this.columns = [
      { key: 'id', title: 'User ID' },
      { key: 'name', title: 'Order No' },
      { key: 'name', title: 'Ordered Date'},
      { key: 'name', title: 'Updated Date' },
      {key: 'Actions', title: 'Actions', searchEnabled: false, cellTemplate: this.Ver}
    ];
  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  } 
  getOrderStatusByUser() {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    const emailId = localStorage.getItem('username');
    if (objUserDetails.userType === userTypes.superAdmin || objUserDetails.userType === userTypes.admin ) {
      this.objService.Get('getOrderStatusByUser?emailId='+ emailId, this.params).subscribe(response => {
        console.log("response",response);
      })
    }
  
  }
  private loadPage(page) {
    // get page of items from api
    this.http.get<any>(`http://localhost:8081/api/items?page=${page }`).subscribe(x => {
        this.pager = x.pager;
        this.pageOfItems = x.pageOfItems;
        this.data = this.pageOfItems
    });
  }

  rowfun(item)
  {
    console.log("item==>",item)
  }

  downloadexcel()
  {
    this.exportToCSV();
  }

  exportToCSV() {
    try {
      /* generate worksheet */
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'file.xlsx');
    } catch (err) {
      console.error('export error', err);
    }
  }


}
