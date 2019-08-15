import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '../../../assets/data/usertype_';
import { Countries } from '../../../assets/data/countrydetails';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { data } from '../../../assets/data/country_';
import { AppConfig } from '../../configs/app.config';
import { userTypes } from '../../common/constants/constants';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  providers: [ConfigurationService]
})
export class CreateCustomerComponent implements OnInit, AfterViewInit {
  @ViewChild('verdelete', {static: false}) Verdelete: TemplateRef<any>;
  @ViewChild('veredit', {static: false}) Veredit: TemplateRef<any>;
  @ViewChild('deletecontent', {static: false}) deletecontent: TemplateRef<any>;

  deleteData:any;
  emailId:any;
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
  constructor(private formBuilder: FormBuilder, private objService: LappRestService, private modalService: NgbModal,) {
    this.configuration = ConfigurationService.config;

  }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      lname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
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
   

  }

  loadUsers() {

    //const userType = localStorage.getItem('userType');

    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));

    if (objUserDetails.userType === userTypes.superAdmin) {
      this.objService.Get('getAllUserDetails', this.param).subscribe(response => {
        this.data = response.userProfileList;
      })
    }
    else if (objUserDetails.userType  === userTypes.admin) {
      this.downflag = 1;
      this.usertypeData = UserType.filter(itm => itm["value"] != "2")
      const emailId = localStorage.getItem('username');
      this.objService.Get('getUserByCreated?emailId=' + emailId, this.params).subscribe(response => {
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

  getPerticularUser(email)
  {

    var emailId = email;
    this.objService.Get('getUserProfile?emailId=' + emailId, this.params).subscribe(res=>{
     this.data = res.userProfileEntity;
    })
  }

  search(event)
  {
    if(event.target.value==='')
    {
      this.loadUsers();
    }
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

  ngAfterViewInit() {
    this.columns = [
      { key: 'firstname', title: 'First Name' },
      { key: 'lastname', title: 'Last Name' },
      { key: 'pid', title: 'User ID' },
      { key: 'uemailId', title: 'Email ID' },
      { key: 'phonenumber', title: 'Phone Number' },
      { key: 'country', title: 'Country' },
      { key: 'userType', title: 'User Type' },
      { key: 'createdBy', title: 'Created By' },
      {key: 'Delete', title: 'Delete', searchEnabled: false, cellTemplate: this.Verdelete},
      {key: 'Edit', title: 'Edit', searchEnabled: false, cellTemplate: this.Veredit}

     
    ]
  }


  deletefun(row)
  {
    //  console.log("delete the row data===>", row)

    
    this.deleteData = row;
    this.modalService.open(this.deletecontent)
  }

  yesDelete()
  {
    let params={
       "consumerId": this.deleteData.consumerId,
     "country": this.deleteData.country,
      "uemailId": this.deleteData.uemailId,
       "createdBy": this.deleteData.createdBy
     }

     this.objService.Post('deleteUser', params).subscribe(res=>{

     })
  }

  editfun(row)
  {

    console.log("edit the row data===>", row)
  }

}
