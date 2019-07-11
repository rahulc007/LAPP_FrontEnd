import { Component, OnInit, ɵConsole } from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {data} from '../../../assets/data/country_';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  country:any;
  submitted = false;
  params={email:"",password:""};
  loginForm: FormGroup;
  name:any;
  password:any;
  userData: any[] = [];
  userList1:any;
  lastkeydown1: number = 0;
  constructor( private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute,private userService: UserService) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      country: ['', Validators.required]
   });
   
    this.userData = data;
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
  
  

  login()
  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    //this.userService.userAuth(this.params).subscribe(data => {

      this.router.navigate(['admin']);

    //});
  }

  

  onProductChanged(country)
  {
    
    let contrydata=this.userData.find(product => product.name === country);
   
  }

}
