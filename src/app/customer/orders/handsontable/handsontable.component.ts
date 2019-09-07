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
  private hotRegisterer = new HotTableRegisterer();
  rownum: any;
  tabledata: any;
  msg: string;
  errorMsg: string;
  firsttime: number = 1;
  errorMessage: string;
  flag: number = 1;
  id = 'hotInstance';
  colmin = 3;
  title = 'sampledemo';
  col = ['L', 'R', 'O'];
  enableRow = []
  columns: object[] = [
    { data: 'L', title: 'L' },
    { data: 'R', title: 'R' },
    { data: 'O', title: 'O' },
  ];
  data: any;
  newAttribute = {};
  items = [];
  params: any;
  markingTestTempArray = [];
  markingTextForm: FormGroup;
  markingTextEditForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private objService: LappRestService) {

  }

  ngOnInit() {

    this.getMarkingTextDetails();
    this.rownum = localStorage.getItem('legsno');
    for (let i = 0; i <= this.rownum; i++) {
      this.enableRow[i] = 'yes'
    }
  }
  getMarkingTextDetails() {
    const lineitemno = localStorage.getItem('lineItemNo');
    this.objService.Get('getMarkingText?lineItemid=' + lineitemno, null).subscribe(response => {
      if (response.markingTextList.length === 0) {
        this.firsttime = 1;
        this.rownum = localStorage.getItem('legsno');
      }
      else {
        this.firsttime = 0;
        this.markingTextForm = this.fb.group({
          arr: this.fb.array([])
        });
        this.rownum = localStorage.getItem('legsno');
        let array = [];
        array = response.markingTextList;
        for (let i = 0; i < this.rownum; i++) {
          if (array[i]) {
            this.items.push(array[i]);
          }
          else {
            this.items.push({ "leftText": null, "middleText": null, "rightText": null })
          }
        }
        this.setFormArray();
      }
    })
  }
  setFormArray() {
    this.markingTextForm = this.fb.group({
      arr: this.fb.array(
        this.items.map(x => this.fb.group({
          leftText: [x.leftText],
          middleText: [x.middleText],
          rightText: [x.rightText]
        }))
      )
    })
  }

  saveData() {
    this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
    let harray = [];
    this.tabledata.forEach(element => {
      harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] })
    });
    const lineitemId = localStorage.getItem('lineitemid');
    const legs = localStorage.getItem('legsno');
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');

    for (let i = 0; i < harray.length; i++) {
      this.markingTestTempArray.push({
        "leftText": harray[i].leftText,
        "rightText": harray[i].middleText,
        "middleText": harray[i].rightText,
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
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = response.successMessage;
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      }
      else if (response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
  }
  submitData() {
    const lineitemId = localStorage.getItem('lineitemid');
    const legs = localStorage.getItem('legsno');
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');

    if (this.markingTestTempArray.length === 0) {
      this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
      let harray = [];
      this.tabledata.forEach(element => {
        harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] })
      });
      for (let i = 0; i < harray.length; i++) {
        this.markingTestTempArray.push({
          "leftText": harray[i].leftText,
          "rightText": harray[i].middleText,
          "middleText": harray[i].rightText,
          "notifyUser": "",
          "updatedBy": emailId,
          "lineItemnumber": lineitemno
        })
      }
    }

    this.params = {
      "lineItemId": lineitemId,
      "isSubmit": true,
      "legsCount": legs,
      "emailId": emailId,
      "markingTextList": this.markingTestTempArray
    }
    this.objService.Post('addMarkingText', this.params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = 'Marking Text Submitted Successfully';
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      }
      else if (response.statusMessage === null || response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
  }

  editMarkingText(markingTextForm) {
    const values = markingTextForm.arr;
    const lineitemId = localStorage.getItem('lineitemid');
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
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = 'Marking Text Labels Edited successfully';
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      }
      else if (response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })

  }
  submitMarkingText(markingTextForm) {
    const values = markingTextForm.arr;
    const lineitemId = localStorage.getItem('lineitemid');
    const legs = localStorage.getItem('legsno');
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');
    this.params = {
      "lineItemId": lineitemId,
      "isSubmit": true,
      "legsCount": legs,
      "emailId": emailId,
      "markingTextList": this.markingTestTempArray
    }
    this.objService.Post('addMarkingText', this.params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = 'Marking Text Submitted Successfully';
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      }
      else if (response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
  }

  editMarkText(i) {
    console.log("edit index=>", i)
    console.log(this.markingTextForm.value.arr[i]);
    this.enableRow[i] = 'no';
  }

  getColumns = (column) => {
    return this.columns[column];
  };

  goPrevious() {
    this.router.navigate(['customer/orderview/:id'])
  }

}
