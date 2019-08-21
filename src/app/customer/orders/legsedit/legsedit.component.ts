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
  numericNumberReg= '^-?[0-9]\\d*(\\.\\d{1,2})?$';

  constructor(private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute) { }
  
  ngOnInit() {

    this.legsForm = this.formBuilder.group({
      rownum: ['', [Validators.required, Validators.pattern(this.numericNumberReg)]],
   });
  }


  onSubmit()
  {

    this.submitted = true;
    if (this.legsForm.invalid) {
        return;
    }

    else {
    this.rownum = this.legsForm.value.rownum;

    sessionStorage.setItem('rownum',this.rownum);
  this.router.navigate(['customer/orderedit/editlegs/:id/legstable'])
    
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
