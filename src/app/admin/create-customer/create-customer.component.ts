import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '../../../assets/data/usertype_';
import { Countries } from '../../../assets/data/countrydetails';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { data } from '../../../assets/data/country_';
import { AppConfig } from '../../configs/app.config';
import { userTypes } from '../../common/constants/constants';
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  providers: [ConfigurationService]
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
  param = '';
  userData: any[] = [];
  public columns: any[] = [];
  public data: any[] = [];
  configuration: any;
  usersData: any;
  errorMsg: string;
  params: any;
  downflag = 0;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService) {
    this.configuration = ConfigurationService.config;

  }

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
    this.userData = data;
    this.loadUsers();
    this.columns = [
      { key: 'firstname', title: 'First Name' },
      { key: 'lastname', title: 'Last Name' },
      { key: 'pid', title: 'User ID' },
      { key: 'uemailId', title: 'Email ID' },
      { key: 'phonenumber', title: 'Phone Number' },
      { key: 'country', title: 'Country' },
      { key: 'userType', title: 'User Type' },
      { key: 'createdBy', title: 'Created By' }
    ]

  }

  loadUsers() {

    const userType = localStorage.getItem('userType');

    if (userType == '1') {
      this.objService.Get('getAllUserDetails', this.param).subscribe(response => {
        console.log('getallUsr', response.userProfileList);
        this.data = response.userProfileList;
      })
    }
    else if (userType == '2') {
      this.downflag = 1;
      this.usertypeData = UserType.filter(itm => itm["value"] != "2")
      const emailId = localStorage.getItem('username');
      this.objService.Get('getUserByCreated?emailId=' + emailId, this.params).subscribe(response => {
        console.log('getallUsr', response.userProfileList[0]);
        this.data = response.userProfileList;
      })
    }
  }
  formSubmit() {
    this.submitted = true;

    if (this.customerForm.invalid) {
      return;
    }

    const uId = localStorage.getItem('username');
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
      "userType": this.getusertypeCode(this.customerForm.value.usertype),
      "createdBy": uId,
      "countryCode": this.getcountrycode(this.customerForm.value.country)
    }
    this.objService.Post('createUser', params).subscribe(datas => {
      console.log('data', datas);
      if (datas.status === 200 && datas.successMessage != null) {
        this.msg = datas.successMessage;
        this.customerForm.reset();
        this.submitted = false;
        // window.location.reload();
        this.loadUsers();
      }
      else if (datas.status === 200 && datas.errorMessage != null) {
        this.errorMsg = datas.errorMessage
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
  getcountrycode(country) {
    let contrycodedata = this.countryData.find(cntry => cntry.CountryName === country);
    console.log(contrycodedata)
    return contrycodedata.countryCode;
  }


  getusertypeCode(user) {
    let usercode = this.usertypeData.find(usr => usr.type === user);

    return usercode.value;
  }

  download() {
    const emailId = localStorage.getItem('username');

    window.location.href = 'http://3.17.182.133:8090/downloadCustData?emailId=' + emailId;

  }

}
