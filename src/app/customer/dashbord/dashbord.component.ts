import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { PasswordStrengthService } from '../../common/password-strength/password-strength.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
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
  constructor(private formBuilder: FormBuilder,
    private objService: LappRestService,
    private ps: PasswordStrengthService) {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    this.showResetPopUp = objUserDetails.firstTimeLogin;
  }


  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      oldPwd: ['', [Validators.required]],
      newPwd: ['', [Validators.required, Validators.minLength(8)]],
      confirmPwd: ['', [Validators.required, this.passwordMatcher.bind(this)]]
    },
      { validator: this.checkPasswords });

  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.oldPwd.value;
    let newPwd = group.controls.newPwd.value;
    return pass === newPwd ? { Same: true } : null
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
          this.passwordReseted = true;
          this.resetForm.reset();
          this.submitted = false;
          this.resetMessage = 'Password Reset done successfully.';

        } else {
          this.resetMessage = 'Something went wrong';
          this.isErrorMessage = true;
        }
      },
        error => {
          this.isErrorMessage = true;
        });
    }
  }

  scorePassword() {
    let objData = this.ps.scorePassword(this.resetForm.value.newPwd);
    this.strColor = objData.strColor;
    this.strText = objData.strText;
  }

  closePopUp() {
    this.showResetPopUp = false;
  }

}
