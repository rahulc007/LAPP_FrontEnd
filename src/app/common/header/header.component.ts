import { Component, OnInit } from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [NgbModal, NgbModalConfig],
})
export class HeaderComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  passmsg: string;
  constructor(private router: Router, private route: ActivatedRoute,
              private config: NgbModalConfig, private modalService: NgbModal,
              private formBuilder: FormBuilder, private userService:UserService) { }

  ngOnInit() {
  }

  signout() {
    this.userService.logout();
  }
  resetPwdOpen(resetPWD) {
      this.modalService.open(resetPWD);
     
  }
  private passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
        this.resetForm &&
        (control.value !== this.resetForm.controls.newPwd.value)
    ) {
        return { passwordNotMatch: true };
    }
    return null;
}

  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }

    console.log(this.resetForm.value);
  }

}

