import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userid: ['', Validators.required],
      country:['', Validators.required],
      State:['', Validators.required],
      City: ['', Validators.required],
      phone: ['', [Validators.required,Validators.minLength(10),Validators.pattern("[0-9]{0-10}")]],
      referncecode:['', Validators.required]
   });
  }

  continue()
  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }

let params={
  "firstname":this.profileForm.value.fname,
  "lastname": this.profileForm.value.lname,
  "email": this.profileForm.value.email
}

    console.log("profile params===>",params)

  }

}
