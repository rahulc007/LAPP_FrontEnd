import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Countries } from '../../../../assets/data/countrydetails';
import {LappRestService  } from '../../../core/rest-service/LappRestService';
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
  state:any;
  stateData: any[]=[];
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) { }


  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      uemailId: ['', [Validators.required, Validators.email]],
      consumerId: ['', Validators.required],
      country:['', Validators.required],
      state:['', Validators.required],
      city: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]]
      // referncecode: ['', Validators.required]
   });
   this.countryData = Countries;
   this.loadUsers();
   
    
   
   
  }
  loadUsers() {
    const userEmail=localStorage.getItem('username');
    this.objService.Get('getUserProfile?emailId='+ userEmail , this.param).subscribe(response => {
      console.log("response", response);
     this.profileData = response.userProfileEntity;
     console.log("profileData",this.profileData)
     let stateNames = this.countryData.find(cntry => cntry.CountryName === this.profileData.country);
    this.stateData = stateNames.States;
    this.profileForm.value.state = this.profileData.state;
    console.log(this.profileData.country);
    console.log( this.stateData)
     //this.getState()
    })
  }
  // getState() {
    

  // }

  // getCities() {
  //   let stateData = this.stateData.find(state => state.StateName === this.state);
  //   this.citiesData = stateData.Cities;
  // }
getCountryName(cCode) {
  let countryDataName= this.countryData.find(name=> name.countryCode === cCode);
  return countryDataName.CountryName;
}
  continue()  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }

let params = {
  "firstname":this.profileForm.value.fname,
  "lastname": this.profileForm.value.lname,
  "email": this.profileForm.value.email
}

    console.log("profile params===>",params)

  }

}
