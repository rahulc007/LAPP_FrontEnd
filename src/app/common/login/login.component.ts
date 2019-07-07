import { Component, OnInit, ɵConsole } from '@angular/core';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {data} from '../../../assets/data/country_'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  country:any;
  params={email:"",password:""};
  name:any;
  password:any;
  userData: any[] = [];
  userList1:any;
  lastkeydown1: number = 0;
  constructor(private router: Router, private route: ActivatedRoute,private userService: UserService) { }

  ngOnInit() {
    
    // this.userService.getUserList().subscribe(data=>{
    //   Object.assign(this.userData, data);
    //   console.log("user data==>",this.userData)
      
    // },
    // error => {
    //   console.log("Something wrong here");
    // })
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
  getcountry(item)
  {
    console.log("contry==>",item)
  }

  login()
  {
    //this.router.navigate(['dashbord'])
    console.log("country===>",this.country)
    this.params.email = this.name;
    this.params.password = this.password;
    //this.userService.userAuth(this.params).subscribe(data => {

      this.router.navigate(['admin']);

    //});
  }

  onProductChanged(country)
  {
    console.log("conty==",country)
    let contrydata=this.userData.find(product => product.name === country);
    console.log("conty data==",contrydata)
  }

}
