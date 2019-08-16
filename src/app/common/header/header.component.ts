import { Component, OnInit} from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {UserService} from '../../core/services/user.service';
import { NavToggleService } from '../../common/nav-toggle-service/navtoggle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [NgbModal, NgbModalConfig],
})
export class HeaderComponent implements OnInit {
  closeResult: string;

  d(e){
      this.closeResult = e;
  }

  resetForm: FormGroup;
  submitted = false;
  passmsg: string;
  usersId: string;
  userType: any;
  constructor(private router: Router, private route: ActivatedRoute,
              private config: NgbModalConfig, private modalService: NgbModal,
              private formBuilder: FormBuilder, private userService:UserService,
              private navService: NavToggleService
              ) { 
                config.backdrop = 'static';
                config.keyboard = false;
              }


  ngOnInit() {
    this.usersId= localStorage.getItem('username');
    this.userType = localStorage.getItem('userType');
  }

  signout() {
    this.userService.logout();
  }
  resetPwdOpen(resetPWD) {
      this.modalService.open(resetPWD);
  }
 
  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }

    console.log(this.resetForm.value);
  }

  toggleNav(){
    this.navService.toggleSideBar();
  }
  // openProfile() {
  //   if(this.userType === "1" || this.userType === "2") {
  //     this.router.navigate(['admin/dashbord/profile']);
  //   }
  //     else if(this.userType === "3") {
  //       this.router.navigate(['customer/dashbord/profile']);
  //   }
  // }

}

