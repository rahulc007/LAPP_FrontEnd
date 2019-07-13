import { Component, OnInit } from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../../core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private UserService:UserService) { }

  ngOnInit() {
  }

  logout()
  {

    this.UserService.logout();
    
  }


}
