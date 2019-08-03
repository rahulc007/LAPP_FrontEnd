import { Component, OnInit } from '@angular/core';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  passmsg: string;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      oldPwd: ['', [Validators.required]],
      newPwd: ['', [Validators.required, Validators.minLength(6)]],
      confirmPwd: ['', [Validators.required, this.passwordMatcher.bind(this)]]
    });

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
      let objPayload = {
        "emailId": 'admin@lapp.com',
        "oldPassword": btoa(this.resetForm.controls.oldPwd.value),
        "newPassword": btoa(this.resetForm.controls.newPwd.value),
        "countryCode": "0"
      }

      this.objService.Post('resetPassword',objPayload).subscribe(res => {
        console.log("reset response",res);
      },
        error => {
        });
    }
  }


}
