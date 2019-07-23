import { Component, OnInit } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import {Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-legsedit',
  templateUrl: './legsedit.component.html',
  styleUrls: ['./legsedit.component.css']
})
export class LegseditComponent implements OnInit {
  legsForm: FormGroup;
  rownum:any;
  submitted = false;
  colmin=3;
  title = 'sampledemo';
  col= ['L', 'R', 'O'];
  data: any;
  private hotRegisterer = new HotTableRegisterer();

  id = 'hotInstance';

  constructor(private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {

    this.legsForm = this.formBuilder.group({
      rownum: ['', Validators.required],
      
   });
  }


  onSubmit()
  {

    this.submitted = true;
    console.log("on submit")
    // stop here if form is invalid
    if (this.legsForm.invalid) {
        return;
    }

   

    else {
    this.rownum = this.legsForm.value.rownum;

    sessionStorage.setItem('rownum',this.rownum);
  this.router.navigate(['customer/orderview/orderedit/editlegs/:id/legstable'])
    
    }
  }



  
  mydata(){
    var tabledata = this.hotRegisterer.getInstance(this.id).getData();
    console.log("handson table ==>",tabledata)
}

getrow(row)
{
console.log("row value===>",row)
this.rownum =row
}

}
