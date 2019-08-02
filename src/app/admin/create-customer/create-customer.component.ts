import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserType} from '../../../assets/data/usertype_';
import {Countries} from '../../../assets/data/countrydetails'


@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  usertypeData:any[] = [];
  countryData:any[]=[];
  citiesData:any[]=[];
  usertype:any;
  country:any;
  state:any;
  city:any;
  customerForm: FormGroup;
  submitted = false;
  stateData:any[]=[];
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() { 
    this.customerForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userid: ['', Validators.required],
      country:['', Validators.required],
      State:['', Validators.required],
      City: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.mobnumPattern)]],
      referncecode: ['', Validators.required],
      usertype: ['', Validators.required]
   });

   this.usertypeData = UserType;
   this.countryData = Countries;
   
  }

  submit()  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.customerForm.invalid) {
        return;
    }

let params = {
  "firstname":this.customerForm.value.fname,
  "lastname": this.customerForm.value.lname,
  "email": this.customerForm.value.email
}

}

clear()
{
  this.usertype = '';
}

countryclear()
{
  this.country ='';
  this.state = '';
  this.city='';
}

stateClear()
{
  this.state = '';
  this.city='';
}

cityClear()
{
  this.city='';
}

getState()
{
 
    let contrydata=this.countryData.find(cntry => cntry.CountryName === this.country);
    this.stateData = contrydata.States; 
} 

getCities()
{
  let stateData = this.stateData.find(state => state.StateName === this.state);
  this.citiesData = stateData.Cities;

  console.log("cities==>", )
}




}
