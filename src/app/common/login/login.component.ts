import { Component, OnInit, ɵConsole ,ViewChild, TemplateRef, ViewEncapsulation, AfterViewInit, OnDestroy} from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {data} from '../../../assets/data/country_';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor( private modalService: NgbModal,private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute,private userService: UserService) { }

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
      "email":this.loginForm.value.username,
      "password":this.loginForm.value.password
    }

   this.userService.login(params).pipe(first()).subscribe(data => {

      this.router.navigate(['admin']);

   },
   error => {
      
     this.message = "Invalid User Name & Password"
     this.loginForm.reset();

      
  });
    
  }


  onProductChanged(country)
  {
    
    let contrydata=this.userData.find(product => product.name === country);
   
  }

}
