import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {LappRestService  } from '../../core/rest-service/LappRestService';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.css']
})
export class PasswordUpdateComponent implements OnInit {
  passwordUpdate: FormGroup;
  submitted: boolean = false;
  msg: string;

  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }


  ngOnInit() {
    this.passwordUpdate = this.formBuilder.group({
      newPwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)] ],
      confirmPwd: ['', [Validators.required, Validators.minLength(6), this.passwordMatcher.bind(this)] ],
    });
    this.submitted = false;

  }

  private passwordMatcher(control: FormControl) {
    if (
      this.passwordUpdate  &&
      (control.value !== this.passwordUpdate.controls.newPwd.value)
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }


  updatePassword() {
    this.submitted = true;
    if (this.passwordUpdate.invalid) {
      return;
    } else {
      console.log(this.passwordUpdate.value)
      let objPayload = {
        "emailId": 'admin@lapp.com',
        "password": btoa(this.passwordUpdate.controls.newPwd.value),
       
      }

      this.objService.Post('updatePwd', objPayload).subscribe(res => {
        console.log("reset response", res);
      },
        error => {
        });
    }
  

}
}
