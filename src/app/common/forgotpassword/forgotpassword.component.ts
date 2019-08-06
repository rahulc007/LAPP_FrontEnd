import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LappRestService  } from '../../core/rest-service/LappRestService';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgotPassword: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }

  ngOnInit() {
    this.forgotPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.submitted = false;
  }
  forgot() {
    this.submitted = true;
    if(this.forgotPassword.invalid) {
      return;
    }
   
console.log("received email==>",this.forgotPassword.value.email)
    let params={"emailId":this.forgotPassword.value.email}

    this.objService.Post('forgot-password',params).subscribe(datas => {
      console.log('data', datas);
      if(datas.status === 200){
        this.msg ='Successfully created User';
       
      }
    })
  }
}
