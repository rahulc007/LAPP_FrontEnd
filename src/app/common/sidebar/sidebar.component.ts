import { Component, OnInit } from '@angular/core';
import {NavToggleService} from '../nav-toggle-service/navtoggle.service';
import {Routes, Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private navService: NavToggleService) { }

  ngOnInit() {
  }

}
