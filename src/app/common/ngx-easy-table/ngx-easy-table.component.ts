import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit , Input} from '@angular/core';
import { ConfigurationService } from './config-service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {UserService} from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ngx-easy-table',
  templateUrl: './ngx-easy-table.component.html',
  styleUrls: ['./ngx-easy-table.component.css'],
  providers:[ConfigurationService]
})
export class NgxEasyTableComponent implements OnInit, AfterViewInit {
 
  @Input() data: Array<any> = [];
  @Input() columns: Array<any> = [];
  @Input() configuration: Array<any> = [];
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute) { 
    if (this.configuration.length <= 0) {

      this.configuration.push( ConfigurationService.config);
      this.configuration = this.configuration[0];
    } else {
      this.configuration = this.configuration[0];
    }
  }

  // version 9.1 and below
  ngOnInit() {
    
    
  }
  ngAfterViewInit() {
    
  }

}
