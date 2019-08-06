import { Component, OnInit, ɵConsole ,ViewChild, TemplateRef, ViewEncapsulation, AfterViewInit, OnDestroy} from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {data} from '../../../assets/data/country_';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  
  @ViewChild('content',{static: false}) content: TemplateRef<any>;
  country:any;
  submitted = false;
  message:any;
  params={email:"",password:""};
  loginForm: FormGroup;
  name:any;
  password:any;
  userData: any[] = [];
  userList1:any;
  lastkeydown1: number = 0;
  countryCode:any;
  selected: string;
  constructor( private modalService: NgbModal,private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute,private userService: UserService) { }

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
      country: ['', Validators.required]
   });
   
    this.userData = data;
    this.selected= data[0].name;
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
  
  
  ngAfterViewInit() {
  }
  
  get f() { return this.loginForm.controls; }

  login()
  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    let params={
      "emailId":this.loginForm.value.username,
      "password":btoa(this.loginForm.value.password),
      "countryCode": this.getcountrycode(this.loginForm.value.country)

    }

   this.userService.login(params).pipe(first()).subscribe(data => {

      this.router.navigate(['admin']);
      this.message = data.successMessage === null ? data.errorMessage: data.successMessage ;
     
  },
   error => {
      
     this.message = error
     this.loginForm.reset();
  
  });
    
  }

  getcountrycode(country)
{
  let contrydata=this.userData.find(cntry => cntry.name === country);
  return contrydata.code;
}

clear() {
 this.selected = '';
}

}
