import { Component, OnInit } from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {NavToggleService} from '../../../../common/nav-toggle-service/navtoggle.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private navService: NavToggleService ) { }

  ngOnInit() {
  }

}
