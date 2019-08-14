import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Countries } from '../../../../assets/data/countrydetails';
import {LappRestService  } from '../../../core/rest-service/LappRestService';
@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted: boolean = false;
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  country: string;
  State: string;
  City: string;

  stateData: any[] = [];
  countryData: any[] = [];
  citiesData: any[] = [];
  param: any;
  profileData: any[] = [];
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }

  ngOnInit() {
    this.initialForm();
    this.countryData = Countries;
    this.loadUsers();
  }
  initialForm() {    
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      uemailId: ['', [Validators.required, Validators.email]],
      consumerId: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]]
    });
    this.submitted = false;
  }

  loadUsers() {
    const userEmail=localStorage.getItem('username');
    this.objService.Get('getUserProfile?emailId='+ userEmail , this.param).subscribe(response => {
      console.log("response", response);
     this.profileData = response.userProfileEntity;
     console.log("profileData",this.profileData)
    })
  }
  getState(event) {
    event.target.value = '';
    this.profileData['city'] = '';
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData['country']);
    this.stateData = stateNames.States;
  }

  getCity(event) {
    event.target.value = '';
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData['country']);
    this.stateData = stateNames.States;
    let cityNames = this.stateData.find(state => state.StateName === this.profileData['state']);
    this.citiesData = cityNames.Cities;
  }
  continue() {
    this.submitted = true;
    if (this.profileForm.invalid) {  
      return;
    }
    console.log(this.profileForm.value)
    let params = {
      "pid": this.profileData['pid'],
      "emailId": this.profileForm.value.uemailId,
      "firstname": this.profileForm.value.firstname,
      "lastname": this.profileForm.value.lastname,
      "state": this.profileForm.value.state,
      "city": this.profileForm.value.city,
      "phonenumber": this.profileForm.value.phonenumber
    }
    console.log("profile params===>", params);

    this.objService.Put('updateProfile', params).subscribe(res => {
      console.log('Response Update Profile', res)

    })
  }
  
  reset() {  
    this.initialForm();
  }

}
