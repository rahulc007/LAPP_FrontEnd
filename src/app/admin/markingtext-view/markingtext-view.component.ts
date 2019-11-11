import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { userTypes } from '../../common/constants/constants';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
@Component({
  selector: 'app-markingtext-view',
  templateUrl: './markingtext-view.component.html',
  styleUrls: ['./markingtext-view.component.css']
})
export class MarkingtextViewComponent implements OnInit{
  configuration: any;
  public columns: any[] = [];
  public data: any[] = [];
  lineitemId: any;
  oid: any;
  constructor(private UserService: UserService, private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private objService: LappRestService) { 
      this.configuration = DefaultConfig;
      this.configuration.searchEnabled = false;
      this.configuration.paginationEnabled = false;
    }

  ngOnInit() {
    this.oid = localStorage.getItem('oid');
    this.lineitemId = parseInt(localStorage.getItem('lineitemid'));
    this.columns = [
      { key: 'leftText', title: 'Left Text' },
      { key: 'rightText', title: 'Right Text' },
      { key: 'middleText', title: 'Others' },
      { key: 'rmPartnoLeft', title:'RM Part No L'},
      { key: 'rmPartnoRight', title: 'RM Part No R'},
      { key: 'rmPartnomiddle', title: 'RM Part No O'}
    ]
    this.viewMarkingText();
  }
viewMarkingText() {
  let Params = {
    "lineItemid": this.lineitemId
  }
  this.objService.Get('getMarkingText', Params).subscribe(response => {
    this.data = response.markingTextList;
  })
}
goPrevious() {
  this.router.navigate(['admin/newordersview', this.oid]);
}
 
}
