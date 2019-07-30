import { Component, OnInit } from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [NgbModal, NgbModalConfig],
})
export class HeaderComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private config: NgbModalConfig, private modalService: NgbModal,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  signout() {
    this.router.navigate(['login']);
  }
  resetPwdOpen(resetPWD) {
      this.modalService.open(resetPWD);
      this.resetForm = this.formBuilder.group ({
        oldPwd: ['', [Validators.required]],
        newPwd: ['', [Validators.required, Validators.minLength(6)]],
        confirmPwd: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: this.passwordMatchValidator
      });
  }
passwordMatchValidator(frm: FormGroup) {
    return frm.controls['newPwd'].value === frm.controls['confirmPwd'].value ? null : {'mismatch': true};
  }
  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }

    console.log(this.resetForm.value);
  }
}

