import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PasswordStrengthService } from '../password-strength/password-strength.service';
import {TranslateService} from'@ngx-translate/core';
@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [NgbModal, NgbModalConfig]
})
export class ResetPasswordComponent implements OnInit {
  @Output() close = new EventEmitter();
  resetForm: FormGroup;
  submitted = false;
  passmsg: string;
  strText = "";
  strColor = "";
  passwordLength: any;
  percent: number;
  passwordStrength: number = 0;
  isErrorMessage: boolean = false;
  resetMessage: string = '';
  constructor(private formBuilder: FormBuilder, private objService: LappRestService,
              private config: NgbModalConfig, private modalService: NgbModal,
              private ps: PasswordStrengthService, private translate: TranslateService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  d(template) {
    this.close.emit(template);
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      oldPwd: ['', [Validators.required]],
      newPwd: ['', [Validators.required, Validators.minLength(8), this.passwordOldNewMatcher.bind(this)]],
      confirmPwd: ['', [Validators.required, this.passwordMatcher.bind(this)]]
    }); 
  }
 
  private progressValue(control: FormControl) {
    if (this.resetForm &&
      (control.value.length != 0)) {
      return this.percent = 50;
    }
    return this.percent = null;
  }


  private passwordMatcher(control: FormControl) {
    if (
      this.resetForm &&
      (control.value !== this.resetForm.controls.newPwd.value)
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }
  private passwordOldNewMatcher(control: FormControl) {
    if (
      this.resetForm &&
      (control.value === this.resetForm.controls.oldPwd.value)
    ) {
      return { passwordMatch: true };
    }
    return null;
  }
  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    } else {
      let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
      let objPayload = {
        "emailId": objUserDetails["username"],
        "oldPassword": btoa(this.resetForm.value.oldPwd),
        "newPassword": btoa(this.resetForm.value.newPwd),
        "countryCode": objUserDetails["countryCode"],
      }

      this.objService.Post('resetPassword', objPayload).subscribe(res => {
        this.isErrorMessage = false;
        if (res.status === 200 && res.statusMessage == 'success') {
          this.resetMessage = this.translate.instant('passwordupdatedsuccess');
          this.resetForm.reset();
          this.submitted = false;
          this.strText = '';
        } else {
          this.isErrorMessage = true;
          this.resetMessage = this.translate.instant('providevalidpassword');
        }
      },
        error => {
        });
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  scorePassword() {
    let objData = this.ps.scorePassword(this.resetForm.value.newPwd);
    this.strColor = objData.strColor;
    this.strText = objData.strText;
  }

}
