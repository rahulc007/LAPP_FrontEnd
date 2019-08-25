import { Component, OnInit } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import { Route, Router } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { LappRestService } from '../../../core/rest-service/LappRestService';
@Component({
  selector: 'app-handsontable',
  templateUrl: './handsontable.component.html',
  styleUrls: ['./handsontable.component.css']
})
export class HandsontableComponent implements OnInit {
  // private hotRegisterer = new HotTableRegisterer();
  rownum: any;
  // tabledata: any;
  msg: string;
  errorMsg: string;
  errorMessage: string;
  // id = 'hotInstance';
  // colmin = 3;
  // title = 'sampledemo';
  // col = ['L', 'R', 'O'];

  // columns: object[] = [
  //   { data: 'L', title: 'L' },
  //   { data: 'R', title: 'R' },
  //   { data: 'O', title: 'O' },
  // ];
  data: any;
  newAttribute = {};
  items = [];
  params: any;
  markingTestTempArray = [{}];
  markingTextForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private objService: LappRestService) {
    this.markingTextForm = this.fb.group({
      arr: this.fb.array([])
    })
  }

  ngOnInit() {
    this.rownum = localStorage.getItem('legsno');
    console.log("row number", this.rownum)
    for (let i = 0; i < this.rownum; i++) {
      this.items.push(this.newAttribute);
    }
    this.setFormArray();
    this.getMarkingTextDetails();
  }
  setFormArray() {
    let arr = this.markingTextForm.controls.arr as FormArray;;
    this.items.forEach(x => {
      arr.push(this.fb.group({
        leftText: x.leftText,
        middleText: x.middleText,
        rightText: x.rightText
      }))
    })
  }

  // saveData() {
  //   this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
  //   //console.log("handson table ==>",tabledata)
  // }
  submit() {
    console.log(this.markingTextForm.value);
    const values = this.markingTextForm.value.arr;
    console.log(values.length)
    const lineitemId = localStorage.getItem('lineitemid');
    console.log('Line item Id', lineitemId);
    const legs = localStorage.getItem('legsno');
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');
    for (let i = 0; i < values.length; i++) {
      this.markingTestTempArray.push({
        "leftText": values[i].leftText,
        "rightText": values[i].middleText,
        "middleText": values[i].rightText,
        "notifyUser": "",
        "updatedBy": emailId,
        "lineItemnumber": lineitemno
      })
    }
    this.params = {
      "lineItemId": lineitemId,
      "isSubmit": false,
      "legsCount": legs,
      "emailId": emailId,
      "markingTextList": this.markingTestTempArray
    }
    this.objService.Post('addMarkingText', this.params).subscribe(response => {
      console.log('Save', response);
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = response.successMessage;
        setTimeout(() => {
          this.msg = '';
        }, 3000);
        this.getMarkingTextDetails();
      }
      else if (response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
        this.getMarkingTextDetails();
      }
    })
  }
  getMarkingTextDetails() {
    const lineitemId = localStorage.getItem('lineitemid');
    this.objService.Get('getMarkingText?lineItemid=' + lineitemId, this.params).subscribe( response => {
      console.log('response',response);
    })
  }
  // submitData() {
  //   console.log("TABLE data=>", this.tabledata)
  //   for (let lineItem of this.tabledata) {
  //     for (let singleValue of lineItem) {
  //       console.log("data=>", singleValue)

  //       if (singleValue === null) {
  //         this.errorMessage = "Please Fill All the Fields...!";
  //         return;
  //       }
  //     }

  //     console.log("single row=>", lineItem)
  //   }
  // }

  // getColumns = (column) => {
  //   return this.columns[column];
  // };

  goPrevious() {
    this.router.navigate(['customer/orderview/:id'])
  }

}
