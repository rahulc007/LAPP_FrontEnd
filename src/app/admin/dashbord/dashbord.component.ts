import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { PasswordStrengthService } from '../../common/password-strength/password-strength.service';
import { TranslateService } from '@ngx-translate/core';
import { userTypes } from '../../common/constants/constants';
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {
  showResetPopUp: boolean = false;
  resetForm: FormGroup;
  submitted: boolean = false;
  strColor: string = '';
  strText: string = '';
  passwordReseted: boolean = false;
  isErrorMessage: boolean = false;
  resetMessage: string = '';
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isCustomer: boolean = false;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService,
    private passwordStrengthService: PasswordStrengthService, private translate: TranslateService) {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    this.showResetPopUp = objUserDetails.firstTimeLogin;
   
    if (objUserDetails.userType == userTypes.superAdmin) {
      this.isSuperAdmin = true;
    }
    if (objUserDetails.userType == userTypes.admin) {
      this.isAdmin = true;
    }
    if (objUserDetails.userType == userTypes.customer) {
      this.isCustomer = true;
    }
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      oldPwd: ['', [Validators.required]],
      newPwd: ['', [Validators.required, Validators.minLength(6), this.passwordOldNewMatcher.bind(this)]],
      confirmPwd: ['', [Validators.required, this.passwordMatcher.bind(this)]]
    });

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
  private passwordMatcher(control: FormControl) {
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
    } else {
      let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
      let objPayload = {
        "emailId": objUserDetails["username"],
        "oldPassword": btoa(this.resetForm.value.oldPwd),
        "newPassword": btoa(this.resetForm.value.newPwd),
        "countryCode": objUserDetails["countryCode"],
      }

      this.objService.Post('resetPassword', objPayload).subscribe(res => {
        if (res.status === 200 && res.statusMessage == 'success') {
          this.resetForm.reset();
          this.submitted = false;
          this.passwordReseted = true;
          this.resetMessage = this.translate.instant('passwordupdatedsuccess');
          setTimeout(()=> {
            this.resetMessage ='';
            this.showResetPopUp = false
       }, 3000);
          this.strText = '';
        } else {
          this.resetMessage = this.translate.instant('providevalidpassword');
          setTimeout(()=> {
            this.resetMessage ='';
          //  this.showResetPopUp = false
       }, 3000);
          this.isErrorMessage = true;
          this.strText = '';
        }
      },
        error => {
          this.isErrorMessage = true;
        });
    }
  }

  scorePassword() {
    let objData = this.passwordStrengthService.scorePassword(this.resetForm.value.newPwd);
    this.strColor = objData.strColor;
    this.strText = objData.strText;
  }

  closePopUp() {
    this.showResetPopUp = false;
  }

}
