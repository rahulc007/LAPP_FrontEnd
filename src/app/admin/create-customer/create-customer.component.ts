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
import {TranslateService} from'@ngx-translate/core'
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  providers: [ConfigurationService]
})
export class CreateCustomerComponent implements OnInit, AfterViewInit {
 // @ViewChild('verdelete', { static: false }) Verdelete: TemplateRef<any>;
  @ViewChild('veredit', { static: false }) Veredit: TemplateRef<any>;
  //@ViewChild('deletecontent', { static: false }) deletecontent: TemplateRef<any>;
  firstname: any;
  isAdmin: boolean;
  lastname: any;
  emailId: any;
  uid: any;
  country: any;
  phone: any;
  editflag = 0;
  searcherror: string;
  deleteData: any;
  usertypeData: any[] = [];
  countryData: any[] = [];
  citiesData: any[] = [];
  editData: any;
  usertype: any;
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
  smailId: any;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService,
    private modalService: NgbModal, private translate: TranslateService ) {
    this.configuration = ConfigurationService.config;

  }

  ngOnInit() {
    this.usertypeData = UserType;
    this.countryData = Countries;
    this.userData = data;
    this.loadUsers();
    this.initial();

  }
  initial() {
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
  }

  loadUsers() {

    //const userType = localStorage.getItem('userType');

    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));

    if (objUserDetails.userType === userTypes.superAdmin) {
      this.objService.Get('getAllUserDetails', this.param).subscribe(response => {
        this.isAdmin = false;

        let arraylist = [];
        arraylist = response.userProfileList;

        arraylist.forEach(list => {
          if (list.userType === userTypes.admin) {
            list.role = 'Admin';
          }
          else if (list.userType === userTypes.superAdmin) {
            list.role = 'Super Admin';
          }
          else if (list.userType === userTypes.customer) {
            list.role = 'Customer';
          }
        })

        this.data = arraylist;
      })
    }
    else if (objUserDetails.userType === userTypes.admin) {
      this.isAdmin = true;
      this.firstname = '';
      this.lastname = '';
      this.emailId = '';
      this.uid = '';
      this.state = '';
      this.city = '';
      this.phone = '';

      this.usertype = 'Customer';
      let contrycodedata = this.countryData.find(cntry => cntry.countryCode === objUserDetails.countryCode);
      this.country = contrycodedata.CountryName;

      this.getState();
      this.downflag = 1;
      this.usertypeData = UserType.filter(itm => itm["value"] != "2")
      const emailId = localStorage.getItem('username');

      this.objService.Get('getUserByCreated?emailId=' + emailId, this.params).subscribe(response => {

        let arraylist = [];
        arraylist = response.userProfileList;

        arraylist.forEach(list => {
          if (list.userType === userTypes.admin) {
            list.role = 'Admin';
          }
          else if (list.userType === userTypes.superAdmin) {
            list.role = 'Super Admin';
          }
          else if (list.userType === userTypes.customer) {
            list.role = 'Customer';
          }
        })

        this.data = arraylist;
      })
      // this.customerForm.reset();
    }

  }

  formSubmit() {
    this.submitted = true;
    this.msg = '';
    this.errorMsg = '';

    if (this.customerForm.invalid) {
      return;
    }
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
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
        this.loadUsers();
        this.msg = this.translate.instant('successMessage');
        setTimeout(()=> {
          this.msg ='';
     }, 3000);
        if (objUserDetails.userType === userTypes.admin) {
          this.selectedReset();
        } else {
          this.customerForm.reset();
        }
      }
      else if (datas.status === 200 && datas.errorMessage != null) {
        this.errorMsg = datas.errorMessage
      }
    })

  }
  selectedReset() {
    this.customerForm.controls['fname'].reset();
    this.customerForm.controls['lname'].reset();
    this.customerForm.controls['email'].reset();
    this.customerForm.controls['userid'].reset();
    this.customerForm.controls['State'].reset();
    this.customerForm.controls['City'].reset();
    this.customerForm.controls['phone'].reset();
  }
  getPerticularUser(email) {

    var emailId = email;
    this.objService.Get('getUserProfile?emailId=' + emailId, this.params).subscribe(res => {

      if (res.userProfileEntity !== null) {

        if (res.userProfileEntity.userType === userTypes.admin) {
          res.userProfileEntity.role = 'Admin';
        }
        else if (res.userProfileEntity.userType === userTypes.superAdmin) {
          res.userProfileEntity.role = 'Super Admin';
        }
        else if (res.userProfileEntity.userType === userTypes.customer) {
          res.userProfileEntity.role = 'Customer';
        }


        this.data = res.userProfileEntity;
        this.searcherror = '';
      }
      else if (res.userProfileEntity === null) {
        this.searcherror = "Email Id is not registered"
      }
    })
  }

  search(event) {
    if (event.target.value === '') {
      this.loadUsers();
      this.searcherror = ''
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
    if (this.citiesData.length === 0) {
      this.city = "''";
    }
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
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));

    if (objUserDetails.userType === userTypes.superAdmin) {
      this.columns = [
        { key: 'firstname', title: 'First Name' },
        { key: 'lastname', title: 'Last Name' },
        { key: 'consumerId', title: 'Customer ID' },
        { key: 'uemailId', title: 'Email ID' },
        { key: 'phonenumber', title: 'Phone Number' },
        { key: 'country', title: 'Country' },
        { key: 'role', title: 'User Type' },
        { key: 'createdBy', title: 'Created By' },
        // { key: 'Delete', title: 'Delete', searchEnabled: false, cellTemplate: this.Verdelete },
        { key: 'Edit', title: 'Edit', searchEnabled: false, cellTemplate: this.Veredit }
      ]
    }
    else if (objUserDetails.userType === userTypes.admin) {
      this.columns = [
        { key: 'firstname', title: 'First Name' },
        { key: 'lastname', title: 'Last Name' },
        { key: 'consumerId', title: 'Customer ID' },
        { key: 'uemailId', title: 'Email ID' },
        { key: 'phonenumber', title: 'Phone Number' },
        { key: 'country', title: 'Country' },
        { key: 'role', title: 'User Type' },
        { key: 'createdBy', title: 'Created By' }
      ]
    }
  }


  // deletefun(row) {
  //   this.deleteData = row;
  //   this.modalService.open(this.deletecontent)
  // }

  yesDelete() {
    let params = {
      "consumerId": this.deleteData.consumerId,
      "country": this.deleteData.country,
      "uemailId": this.deleteData.uemailId,
      "createdBy": this.deleteData.createdBy
    }

    this.objService.Post('deleteUser', params).subscribe(res => {

    })
  }

  editfun(row) {

    this.editflag = 1;
    this.msg = "";
    this.errorMsg = "";
    this.firstname = row.firstname
    this.lastname = row.lastname
    this.emailId = row.uemailId
    this.uid = row.consumerId

   // let contrycodedata = this.countryData.find(cntry => cntry.countryCode === row.country);
    this.country = row.country;
    this.getState();
    this.state = row.state;
    this.city = row.city;
    this.phone = row.phonenumber;
    this.editData = row;

    let usercode = this.usertypeData.find(usr => usr.value === row.userType);

    this.usertype = usercode.type
  }

  create() {
    this.editflag = 0;
    this.msg = "";
    this.errorMsg = "";
    this.customerForm.reset();
  }

  updateUser() {

    this.msg = '';
    this.errorMsg = '';

  if(this.customerForm.valid)
  {

    let params = {
      "pid": this.editData.pid,
      "emailId": this.emailId,
      "firstname": this.firstname,
      "lastname": this.lastname,
      "state": this.state,
      "city": this.city,
      "phonenumber": this.phone
    }

    this.objService.Put('updateProfile', params).subscribe(res => {

      if (res.status == 200 && res.statusMessage == "success") {

        this.loadUsers();
        this.msg = res.successMessage;
      }
      else if (res.status == 200 && res.statusMessage == "error") {
        this.errorMsg= res.errorMessage;
      }

    })
  
}
else if(this.customerForm.invalid){
     this.errorMsg = "Failed to update"
}
}
}
