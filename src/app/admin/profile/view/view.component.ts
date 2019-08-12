
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
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  countryData: any[] = [];
  selectedCountry: string;
  profileData: any;
  param: '';
  stateData: any[] = [];
  citiesData: any[] = [];
  userTypeValue: any;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }


  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      uemailId: ['', [Validators.required, Validators.email]],
      consumerId: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]]
      // referncecode: ['', Validators.required]
    });
    this.countryData = Countries;
    // this.loadUsers();
    this.userTypeValue= localStorage.getItem('userType');
    console.log(this.userTypeValue)
  }
  loadUsers() {
    const userEmail = localStorage.getItem('username');
    this.objService.Get('getUserProfile?emailId=' + userEmail, this.param).subscribe(response => {
      this.profileData = response.userProfileEntity;
    })
  }
  getState(event) {
    event.target.value = '';
    this.profileData.city = '';
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData.country);
    this.stateData = stateNames.States;
  }

  getCity(event) {
    event.target.value = '';
    let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData.country);
    this.stateData = stateNames.States;
    let cityNames = this.stateData.find(state => state.StateName === this.profileData.state);
    this.citiesData = cityNames.Cities;
  }
  
  continue() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    let params = {
      "pid": this.profileData.pid,
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

}
