import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgotPassword: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

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
    console.log(this.forgotPassword.value.email);
  }
}
