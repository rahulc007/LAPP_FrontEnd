
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
