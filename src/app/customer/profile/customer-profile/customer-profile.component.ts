import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  customerProfileForm: FormGroup;
  submitted = false;
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.customerProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      userId: ['', Validators.required],
      country:['', Validators.required],
      State:['', Validators.required],
      City: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]],
      referenceCode: ['', Validators.required]
   });
  }
  continue()  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.customerProfileForm.invalid) {
        return;
    }
  }
}
