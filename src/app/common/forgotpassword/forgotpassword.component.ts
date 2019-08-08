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
  msg: string;

  constructor(private formBuilder: FormBuilder, private objService: LappRestService, private router: Router) { }

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
   
    let params={"emailId":this.forgotPassword.value.email}

    this.objService.Post('forgotPassword',params).subscribe(datas => {
      console.log('data', datas);
      if(datas.status === 200){
        
        this.router.navigate(['login/passwordupdate']);
       
      }
    })
  }
}
