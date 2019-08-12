import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  userType: any;
  constructor(private router: Router) { }

  ngOnInit() {
   this.userType = localStorage.getItem('userType');
  }

}
