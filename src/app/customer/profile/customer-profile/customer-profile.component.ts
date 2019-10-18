import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Countries } from '../../../../assets/data/countrydetails';
import { LappRestService } from '../../../core/rest-service/LappRestService';
@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted: boolean = false;
  mobnumPattern = '^[- +()]*[0-9][- +()0-9]*$';
  country: string;
  State: string;
  City: string;

  stateData: any[] = [];
  countryData: any[] = [];
  citiesData: any[] = [];
  param: any;
  profileData: any[] = [];
  msg: any;
  errorMsg: any;
  citydisabled = 0;
  stateNotFound: any;
  cityNotFound: any;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }

  ngOnInit() {
    this.initialForm();
    this.countryData = Countries;
    this.loadUsers();
  }
  initialForm() {
    this.profileForm = this.formBuilder.group({
      firstname: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      lastname: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      uemailId: ['', [Validators.required, Validators.email]],
      consumerId: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phonenumber: ['', [Validators.minLength(10), Validators.pattern(this.mobnumPattern)]]
    });
    this.submitted = false;
  }

  loadUsers() {
    const userEmail = localStorage.getItem('username');
    this.objService.Get('getUserProfile?emailId=' + userEmail, this.param).subscribe(response => {
      this.profileData = response.userProfileEntity;

      let countryData = this.countryData.find(cntry => cntry.countryCode === this.profileData['countryCode']);
      this.profileData['country']= countryData.CountryName;
    })
  }
  getState() {
    this.profileData['city'] = '';
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData['country']);
    this.stateData = stateNames.States;
  }
  filterState(event) {
    let passed = true
    this.stateData.forEach(element => {
      if(event.target.value === element.StateName) {
        passed = false
      } 
    })
    if(passed) {
      this.stateNotFound = true;
      this.profileForm.controls['state'].setErrors({'incorrect': true});
      this.profileData['city'] ='';
      this.citydisabled = 1;
    } else {
      this.stateNotFound = false;
      this.citydisabled = 0;
      this.getCity()
    }   
  }
  filterCity(event) {
    let passed = true
    this.citiesData.forEach(element => {
      if(event.target.value === element) {
        passed = false
      } 
    })
    if(passed) {
      this.cityNotFound = true;
      this.profileForm.controls['city'].setErrors({'incorrect': true});
    } else {
      this.cityNotFound = false;
    } 
  }
  getCity() {
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData['country']);
    this.stateData = stateNames.States; 
    let cityNames = this.stateData.find(state => state.StateName === this.profileData['state']);
    this.citiesData = cityNames.Cities;
    if (this.citiesData.length === 0) {
      this.profileData['city'] = "''";
      this.citydisabled = 1;
    }
    else if(this.citiesData.length !== 0){
      this.citiesData = cityNames.Cities;
      this.citydisabled = 0;
    }
  }
  continue() {
    this.submitted = true;
    // if (this.profileForm.invalid) {
    //   return;
    // }
    let params = {
      "pid": this.profileData['pid'],
      "emailId": this.profileForm.value.uemailId,
      "firstname": this.profileForm.value.firstname,
      "lastname": this.profileForm.value.lastname,
      "state": this.profileForm.value.state,
      "city": this.profileForm.value.city,
      "phonenumber": this.profileForm.value.phonenumber
    }

    this.objService.Put('updateProfile', params).subscribe(res => {
      if (res.status && res.statusMessage === 'success') {
        this.msg=res.successMessage;
        setTimeout(()=> {
          this.msg ='';
     }, 3000);
      }
      else if(res.errorMessage !== null) {
        this.errorMsg= res.errorMessage;
      }

    })
  }

  reset() {
    this.initialForm();
  }

}
