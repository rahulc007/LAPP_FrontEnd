import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service'

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css']
})
export class NewOrdersComponent implements OnInit {
  configuration: any;
  private data:any[]=[];
  private colHeaders: string[] = ['ID', 'First Name', 'Last Name', 'Address',
    'Favorite food', 'Price', 'Is active'];
  constructor() {this.configuration = ConfigurationService.config; }

  ngOnInit() {
  }

}
