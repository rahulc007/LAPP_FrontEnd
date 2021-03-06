import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '../../../assets/data/usertype_';
import { Countries } from '../../../assets/data/countrydetails';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { data } from '../../../assets/data/country_';
import { AppConfig } from '../../configs/app.config';
import { userTypes } from '../../common/constants/constants';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  providers: [ConfigurationService]
})
export class CreateCustomerComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('veredit', { static: false }) Veredit: TemplateRef<any>;

  firstname: any;
  cntryflag = 1;
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
  mobnumPattern = '^[- +()]*[0-9][- +()0-9]*$';
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
  citydisabled =0;
  stateNotFound: any
  cityNotFound: any;
  constructor(private formBuilder: FormBuilder, private objService: LappRestService,
    private modalService: NgbModal, private translate: TranslateService,
    private cdr: ChangeDetectorRef) {
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
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (objUserDetails.userType === userTypes.superAdmin) {
      this.cntryflag = 0;
      this.objService.Get('getAllUserDetails', this.param).subscribe(response => {
        this.isAdmin = false;
        let arraylist = [];
        arraylist = response.userProfileList;
        arraylist.forEach(contry => {
         if(contry.country.length === 2) {
          let countryName= this.countryData.find(code => code.countryCode === contry.country);
          contry.country = countryName.CountryName
         }
        })
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
      this.cntryflag = 1;
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
        arraylist.forEach(contry => {
          if(contry.country.length === 2) {
           let countryName= this.countryData.find(code => code.countryCode === contry.country);
           contry.country = countryName.CountryName
          }
         })
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
        setTimeout(() => {
          this.msg = '';
        }, 3000);
        if (objUserDetails.userType === userTypes.admin) {
          this.selectedReset();
        } else {
          this.customerForm.reset();
        }
      }
      else if (datas.status === 200 && datas.errorMessage != null) {
        if(datas.errorMessage === 'EmailId already exists..!'){
          this.errorMsg = this.translate.instant('errormessages.0') ;
        }
          else if(datas.errorMessage === 'Customer ID already exists..!'){
            this.errorMsg = this.translate.instant('errormessages.1') ;
          }
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
        this.searcherror = this.translate.instant('emailidnotregistered');
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
    this.state = '';
    this.city = '';
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
      this.customerForm.controls['State'].setErrors({'incorrect': true});
      this.city = '';
      this.citydisabled = 1;
    } else {
      this.stateNotFound = false;
      this.citydisabled = 0;
      this.getCities();
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
      this.customerForm.controls['City'].setErrors({'incorrect': true});
    } else {
      this.cityNotFound = false;
    } 
  }
  getState() {
    this.state = '';   
    let contrydata = this.countryData.find(cntry => cntry.CountryName === this.country);
    this.stateData = contrydata.States;
  }

  getCities() {
    this.city = '';
    let stateData = this.stateData.find(state => state.StateName === this.state);
    this.citiesData = stateData.Cities;
    if (this.citiesData.length === 0) {
      this.city = "''";
      this.citydisabled = 1;
    }
    else if(this.citiesData.length !== 0){
      this.citiesData = stateData.Cities;
      this.citydisabled = 0;
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
    window.location.href = this.objService._BaseUrl + 'downloadCustData?emailId=' + emailId;
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
  ngAfterViewChecked(){
    this.cdr.detectChanges();
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
    this.cntryflag = 1;
    this.msg = "";
    this.errorMsg = "";
    this.firstname = row.firstname
    this.lastname = row.lastname
    this.emailId = row.uemailId
    this.uid = row.consumerId
    let contrydata = this.countryData.find(cntry => cntry.countryCode === row.countryCode);

    this.country = contrydata.CountryName;
    this.getState();
    this.state = row.state;
    this.city = row.city;
    this.phone = row.phonenumber;
    this.editData = row;
    let usercode = this.usertypeData.find(usr => usr.value === row.userType);
    this.usertype = usercode.type;
  }

  create() {
    this.editflag = 0;
    this.cntryflag = 0;
    this.msg = "";
    this.errorMsg = "";
    this.customerForm.reset();
  }

  updateUser() {
    this.msg = '';
    this.errorMsg = '';
    if (this.customerForm.valid) {
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
          setTimeout(() => {
            this.msg = '';
          }, 3000);
          this.editflag = 0;
          this.customerForm.reset();
        }
        else if (res.status == 200 && res.statusMessage == "error") {
          this.errorMsg = res.errorMessage;
          setTimeout(() => {
            this.errorMsg = '';
          }, 3000);
        }
      })
    }
    else if (this.customerForm.invalid) {
      this.errorMsg = this.translate.instant('failtoupdate');
    }
  }
}
