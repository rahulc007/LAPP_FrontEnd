import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {LappRestService  } from '../../core/rest-service/LappRestService';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.css']
})
export class PasswordUpdateComponent implements OnInit {
  passwordUpdate: FormGroup;
  submitted: boolean = false;
  msg: string;
  emailId:any;

  constructor(private formBuilder: FormBuilder, private objService: LappRestService, private route: ActivatedRoute) { }


  ngOnInit() {
    this.passwordUpdate = this.formBuilder.group({
      newPwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)] ],
      confirmPwd: ['', [Validators.required, Validators.minLength(6), this.passwordMatcher.bind(this)] ],
    });
    this.submitted = false;

    // this.route.paramMap.subscribe(params=>{
    //   this.emailId = params.get('emailId');
    // });


    this.route.queryParams.subscribe(params=>{
      this.emailId = params['emailId'];
    })


    console.log("email Id ===>", this.emailId)
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
        "emailId":  this.emailId ,
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
