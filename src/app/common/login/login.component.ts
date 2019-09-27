import { Component, OnInit, ɵConsole, ViewChild, TemplateRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { data } from '../../../assets/data/country_';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { userTypes } from '../constants/constants';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('content', { static: false }) content: TemplateRef<any>;
  country: any;
  submitted = false;
  message: any;
  params = { email: "", password: "" };
  loginForm: FormGroup;
  name: any;
  password: any;
  userData: any[] = [];
  userList1: any;
  lastkeydown1: number = 0;
  countryCode: any;
  selected: string;
  passwordLength: any;
 
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute, private userService: UserService) { 
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(currentUser && currentUser.token)
 {
      if (currentUser.userType == userTypes.superAdmin || currentUser.userType == userTypes.admin) {
        this.router.navigate(['admin']);
      } else if (currentUser.userType == userTypes.customer) {
        this.router.navigate(['customer']);
      }
    }
    else{
      this.router.navigate(['login'])
    }

    }

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(60)]],
      country: ['', Validators.required]
    });
    this.userData = data;
    this.selected = data[0].name;
  }
  private passwordStrength(control: FormControl) {

    if (this.loginForm &&
      (control.value.length != 0 && control.value.length < 6)) {
      return this.passwordLength = 'Week Password'
    } else if (control.value.length == 0) {
      return this.passwordLength = ''
    }
  }
  pwdStrength() {

    if ((this.loginForm.value.password.length != 0 && this.loginForm.value.password.length < 6)) {
      return this.passwordLength = 'Week Password'
    } else if (this.loginForm.value.password.length == 0) {
      return this.passwordLength = ''
    }
  }

  keyDownFunction(event) {

    console.log("entered the key")
    if (event.keyCode == 13) {
      this.login();
    }
  }

  getUserIdsFirstWay($event) {
    let userId = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
    this.userList1 = [];

    if (userId.length > 2) {
      if ($event.timeStamp - this.lastkeydown1 > 200) {
        this.userList1 = this.searchFromArray(this.userData, userId);
      }
    }
  }

  searchFromArray(arr, regex) {
    let matches = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches;
  };

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    let params = {
      "emailId": this.loginForm.value.username,
      "password": btoa(this.loginForm.value.password),
      "countryCode": this.getcountrycode(this.loginForm.value.country)

    }

    this.userService.login(params).pipe(first()).subscribe(data => {
      if (data.statusMessage === 'success') {
        if (data.userType == userTypes.superAdmin || data.userType == userTypes.admin) {
          this.router.navigate(['admin']);
        } else if (data.userType == userTypes.customer) {
          this.router.navigate(['customer']);
        }
      } else {
        this.message = data.errorMessage;
      }

    },
      error => {
        this.message = error
        this.loginForm.reset();
      });

  }

  getcountrycode(country) {
    let contrydata = this.userData.find(cntry => cntry.name === country);
    return contrydata.code;
  }

  clear() {
    this.selected = '';
  }

  // OnLoadFile(event) {
  //   let fileReader = new FileReader();
  //   for (let file of event.target.files) {
  //     fileReader.onload = () => {
  //       let arrayBuffer = fileReader.result;
  //       var workbook = XLSX.read(arrayBuffer, { type: "binary" });
  //       workbook.SheetNames.forEach(function (sheetName) {
  //         // Here is your object
  //         var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  //         var json_object = JSON.parse(JSON.stringify(XL_row_object));
  //         console.log(json_object);
  //       })
  //     }
  //     fileReader.readAsBinaryString(file);

  //   }
  // }



}
