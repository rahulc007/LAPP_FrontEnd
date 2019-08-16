import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LappRestService  } from '../../core/rest-service/LappRestService';
import {Router} from '@angular/router'

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgotPassword: FormGroup;
  submitted: boolean = false;
  errorMsg: string;
  successMsg: string;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService, private router: Router) { }

  ngOnInit() {
    this.forgotPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.submitted = false;
  }
  forgot() {
    this.submitted = true;
    this.successMsg = '';
    this.errorMsg = '';
    if(this.forgotPassword.invalid) {
      return;
    }
   
    let params={"emailId":this.forgotPassword.value.email}

    this.objService.Post('forgotPassword',params).subscribe(datas => {
      console.log('data', datas);
      if(datas.status === 200 && datas.statusMessage === 'success'){
        this.successMsg='Password link sent to your registered E-mail ID Successfully !';
       // this.router.navigate(['login/passwordupdate', this.forgotPassword.value.email]);
      }
      else if(datas.statusMessage === 'error'){
        this.errorMsg = 'Email Id is not registered';
      }
    })
  }
}
