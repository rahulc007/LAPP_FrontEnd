import { Component, OnInit } from '@angular/core';
import { NavToggleService } from '../nav-toggle-service/navtoggle.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { userTypes } from '../constants/constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;

  primarySampleComponent: any;
  constructor(private navService: NavToggleService) {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType == userTypes.superAdmin) {
      this.isSuperAdmin = true;
    }
    if (objUserDetails.userType == userTypes.admin) {
      this.isAdmin = true;
    }
  }

  ngOnInit() {
  }

}
