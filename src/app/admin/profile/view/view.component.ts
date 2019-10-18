
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Countries } from '../../../../assets/data/countrydetails';
import { LappRestService } from '../../../core/rest-service/LappRestService';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  profileForm: FormGroup;
  submitted = false;
  mobnumPattern = '^[- +()]*[0-9][- +()0-9]*$'; 
  countryData: any[] = [];
  selectedCountry: string;
  profileData: any[] = [];
  param: '';
  stateData: any[] = [];
  citiesData: any[] = [];
  userTypeValue: any;
  msg: any;
  errorMsg: any;
  stateNotFound: any;
  citydisabled =0;
  cityNotFound: any;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      firstname: ['', [ Validators.pattern('^[a-zA-Z ]*$')]],
      lastname: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      uemailId: ['', [Validators.required, Validators.email]],
      consumerId: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phonenumber: ['', [Validators.pattern(this.mobnumPattern)]]
      // referncecode: ['', Validators.required]
    });
    this.countryData = Countries;
    this.userTypeValue = localStorage.getItem('userType');
    if (this.userTypeValue !== "1") {
      this.loadUsers();
    }
  }
  loadUsers() {
    const userEmail = localStorage.getItem('username');
    this.objService.Get('getUserProfile?emailId=' + userEmail, this.param).subscribe(response => {
      this.profileData = response.userProfileEntity;
    })
  }
  getState() {
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData['country']);
    this.stateData = stateNames.States; 
    this.profileData['city'] ='';
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
    this.msg = '';
    this.errorMsg = ''
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
        this.msg = res.successMessage;
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      }
      else if (res.errorMessage !== null) {
        this.errorMsg = res.errorMessage;
      }
      this.loadUsers();
    })

  }

}
