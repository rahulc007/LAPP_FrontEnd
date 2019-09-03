import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LappRestService  } from '../../core/rest-service/LappRestService';
import {Router} from '@angular/router'
import {TranslateService} from'@ngx-translate/core';
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
  constructor(private formBuilder: FormBuilder, private objService: LappRestService,
    private router: Router, private translate: TranslateService) { }

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
      if(datas.status === 200 && datas.statusMessage === 'success'){
        this.successMsg = this.translate.instant('passwordlinksent');
        this.forgotPassword.reset();
        setTimeout(()=> {
          this.successMsg ='';
     }, 7000);
      }
      else if(datas.statusMessage === 'error'){
        this.errorMsg = this.translate.instant('emailidnotregistered');
        setTimeout(()=> {
          this.errorMsg ='';
     }, 5000);
      }
    })
  }
}
