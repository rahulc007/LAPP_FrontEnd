import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Countries } from '../../../../assets/data/countrydetails';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  customerProfileForm: FormGroup;
  submitted: boolean = false;
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  country: string;
  State: string;
  City: string;

  stateData: any[] = [];
  countryData: any[] = [];
  cityData: any[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initialForm();
    this.countryData = Countries;
  }
  initialForm() {    
    this.customerProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      userId: ['', Validators.required],
      country: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]],
      referenceCode: ['', Validators.required]
    });
    this.submitted = false;
  }
  continue() {
    this.submitted = true;
    if (this.customerProfileForm.invalid) {  
      return;
    }
    console.log(this.customerProfileForm.value)
  }
  clear() {
    this.country = '';
    this.State = '';
    this.City = '';
  }
  stateClear() {
    this.State = '';
  }
  cityClear() {
    this.City = '';
  }
  reset() {  
    this.initialForm();
  }
  
  getStates() {
    let contrydata = this.countryData.find(cntry => cntry.CountryName === this.country);
    this.stateData = contrydata.States;
  }
  getCities() {
    let stateData = this.stateData.find(state => state.StateName === this.State);
    this.cityData = stateData.Cities;
  }
}
