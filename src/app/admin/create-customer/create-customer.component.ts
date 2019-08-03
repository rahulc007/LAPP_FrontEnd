import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '../../../assets/data/usertype_';
import { Countries } from '../../../assets/data/countrydetails';
import {LappRestService  } from '../../core/rest-service/LappRestService';


@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  usertypeData: any[] = [];
  countryData: any[] = [];
  citiesData: any[] = [];
  usertype: any;
  country: any;
  state: any;
  city: any;
  customerForm: FormGroup;
  submitted = false;
  stateData: any[] = [];
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  msg: string = '';
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userid: ['', Validators.required],
      country: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]],
      // referncecode: ['', Validators.required],
      usertype: ['', Validators.required]
    });
    this.submitted = false;
    this.usertypeData = UserType;
    this.countryData = Countries;

  }

  formSubmit() {
    this.submitted = true;

    if (this.customerForm.invalid) {
      return;
    }
      console.log('Form Values', this.customerForm.value);
    

    const params = {
      "emailId": this.customerForm.value.email,
      "firstname": this.customerForm.value.fname,
      "lastname": this.customerForm.value.lname,
      "consumerId": this.customerForm.value.userid,
      "country": this.customerForm.value.country,
      "state": this.customerForm.value.State,
      "city": this.customerForm.value.City,
      "phonenumber": this.customerForm.value.phone,
      "userTYpe": this.customerForm.value.usertype,
      "createdBy": "user_emailID",
      "countryCode": "001"
    }
    this.objService.Post('createUser',params).subscribe(data => {
      console.log('data', data);
      if(data.status === 200){
        this.msg ='Successfully created User';
        this.customerForm.reset();
        this.submitted = false;
        window.location.reload();
      }
    })

  }

  clear() {
    this.usertype = '';
  }

  countryclear() {
    this.country = '';
    this.state = '';
    this.city = '';
  }

  stateClear() {
    this.state = '';
    this.city = '';
  }

  cityClear() {
    this.city = '';
  }

  getState() {

    let contrydata = this.countryData.find(cntry => cntry.CountryName === this.country);
    this.stateData = contrydata.States;
  }

  getCities() {
    let stateData = this.stateData.find(state => state.StateName === this.state);
    this.citiesData = stateData.Cities;
  }

}
