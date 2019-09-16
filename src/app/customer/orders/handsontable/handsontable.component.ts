import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import { Route, Router } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-handsontable',
  templateUrl: './handsontable.component.html',
  styleUrls: ['./handsontable.component.css']
})
export class HandsontableComponent implements OnInit {
  @ViewChild('submitConfirm', { static: false }) submitConfirm: TemplateRef<any>;
  @ViewChild('deleteConfirm', { static: false }) deleteConfirm: TemplateRef<any>;
  @ViewChild('editModel', { static: false }) editModel: TemplateRef<any>;

  private hotRegisterer = new HotTableRegisterer();
  rownum: any;
  editObj = { "leftmarking": "", "rightmarking": "", "middlemarking": "", "markingId": "" }
  deleteData: any;
  legsCount: any;
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
  values: any;
  blnShowSaveNewRowButton: boolean = false;
  constructor(private router: Router, private fb: FormBuilder, private objService: LappRestService, private modalService: NgbModal, private translate: TranslateService) {


  }

  ngOnInit() {

    this.getMarkingTextDetails();
    this.rownum = localStorage.getItem('legsno');
    this.legsCount = localStorage.getItem('legsno');
    // for (let i = 0; i <= this.rownum; i++) {
    //   this.enableRow[i] = 'yes'
    // }
  }

  getMarkingTextDetails() {
    const lineitemno = localStorage.getItem('lineItemNo');
    this.objService.Get('getMarkingText?lineItemid=' + lineitemno, null).subscribe(response => {
      if (response.markingTextList.length === 0 && this.firsttime) {
        this.firsttime = 1;
        this.rownum = localStorage.getItem('legsno');
      }
      else {
        this.firsttime = 0;
        for (let i = 0; i <= this.rownum; i++) {
          this.enableRow[i] = 'yes'
        }
        this.markingTextForm = this.fb.group({
          arr: this.fb.array([])
        });
        // this.rownum = localStorage.getItem('legsno');
        this.items = [];
        this.rownum = this.legsCount;
        for (let objRow of response.markingTextList) {
          objRow["cIsNew"] = false;
          this.items.push(objRow);
        }
        this.items =  this.items.sort((a,b)=>a.markingId - b.markingId);
        
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
          rightText: [x.rightText],
          markingId: [x.markingId]
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
    const legs = this.legsCount;
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
    const legs = this.legsCount;
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
        this.modalService.open(this.submitConfirm);
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
        "markingId": values[i].markingId,
        "notifyUser": "",
        "updatedBy": emailId,
        "lineItemnumber": lineitemno
      })
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
        this.msg = this.translate.instant('updateMessage');

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

  deleteMarkTextModel(row) {
    if (row["cIsNew"] == true) {
      let iIndex = this.items.indexOf(row);
      if (iIndex >= 0) {
        this.items.splice(iIndex, 1);
        if (!(this.items.find(x => x["cIsNew"] == true))) {
          this.blnShowSaveNewRowButton = false;
          this.setFormArray();
        }
      }
    } else {
      this.deleteData = row;
      this.modalService.open(this.deleteConfirm);
    }
  }

  deleteMarkingText() {
    const lineitemId = localStorage.getItem('lineitemid');
    let legs = localStorage.getItem('legsno');
    this.legsCount = parseInt(legs) - 1;
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');


    let params = {
      "lineItemId": lineitemId,
      "isSubmit": true,
      "emailId": emailId,
      "legsCount": this.legsCount,
      "markingId": this.deleteData.markingId,
    }

    this.objService.Post('deleteMarkingText', params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = this.translate.instant('deleteMessage');
        this.modalService.dismissAll();
        // this.getMarkingTextDetails()
        setTimeout(() => {
          this.msg = '';
        }, 3000);
        this.getMarkingTextDetails()
      }
      else if (response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
  }

  openModel(markingTextForm) {
    this.values = markingTextForm.arr;
    this.modalService.open(this.submitConfirm);
  }

  submitMarkingText(markingTextForm) {
    const lineitemId = localStorage.getItem('lineitemid');
    const legs = localStorage.getItem('legsno');
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');
    if (this.markingTestTempArray.length === 0) {
      for (let i = 0; i < this.values.length; i++) {
        this.markingTestTempArray.push({
          "leftText": this.values[i].leftText,
          "rightText": this.values[i].middleText,
          "middleText": this.values[i].rightText,
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
      else if (response.errorMessage === 'Invalid request..!' || response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
    this.modalService.dismissAll();
  }

  editMarkText(i, row) {

    //this.enableRow[i] = 'no';
    console.log("edit row=>", row)

    this.editObj.rightmarking = row.rightText
    this.editObj.leftmarking = row.leftText
    this.editObj.middlemarking = row.middleText;
    this.editObj.markingId = row.markingId

    this.modalService.open(this.editModel);
  }

  updateMarkingText() {

    const lineitemId = localStorage.getItem('lineitemid');
    const legs = this.legsCount;
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');

    let params = {
      "lineItemId": lineitemId,
      "isSubmit": true,
      "emailId": emailId,
      "legsCount": legs,
      "markingId": this.editObj.markingId,
      "leftText": this.editObj.leftmarking,
      "rightText": this.editObj.rightmarking,
      "middleText": this.editObj.middlemarking

    }

    this.objService.Post('updateMarkingText', params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = this.translate.instant('updateMessage');

        setTimeout(() => {
          this.msg = '';
        }, 3000);
        this.getMarkingTextData()
      }
      else if (response.errorMessage === 'Invalid request..!' || response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
    this.modalService.dismissAll();

  }


  getMarkingTextData() {
    this.items = [];
    const lineitemno = localStorage.getItem('lineItemNo');
    this.objService.Get('getMarkingText?lineItemid=' + lineitemno, null).subscribe(response => {

      this.firsttime = 0;
      for (let i = 0; i <= this.rownum; i++) {
        this.enableRow[i] = 'yes'
      }
      this.markingTextForm = this.fb.group({
        arr: this.fb.array([])
      });
      // this.rownum = localStorage.getItem('legsno');
      this.rownum = this.legsCount;
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

    })
  }




  getColumns = (column) => {
    return this.columns[column];
  };

  goPrevious() {
    this.router.navigate(['customer/orderview/:id'])
  }

  addNewRow() {
    this.legsCount = this.items.length + 1;
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');
    let objNewRow = {
      "leftText": '',
      "rightText": '',
      "middleText": '',
      "notifyUser": "",
      "updatedBy": emailId,
      "lineItemnumber": lineitemno,
      "cIsNew": true
    }
    this.enableRow[this.items.length] = 'no';
    this.items.push(objNewRow);
    this.blnShowSaveNewRowButton = true;
    this.setFormArray();
  }

  onClickSaveNewRow() {
    const lineitemId = localStorage.getItem('lineitemid');
    const legs = this.legsCount;
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');
    let arrNewRow = [];
    const values = this.markingTextForm.value.arr;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]["cIsNew"] == true) {
        arrNewRow.push({
          "leftText": values[i].leftText,
          "rightText": values[i].rightText,
          "middleText": values[i].middleText,
          "notifyUser": "",
          "updatedBy": emailId,
          "lineItemnumber": lineitemno
        })
      }

    }
    this.params = {
      "lineItemId": lineitemId,
      "isSubmit": false,
      "legsCount": legs,
      "emailId": emailId,
      "markingTextList": arrNewRow
    }
    this.objService.Post('addMarkingText', this.params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = response.successMessage;
        this.blnShowSaveNewRowButton = false;
        this.getMarkingTextData();
        setTimeout(() => {
          this.msg = '';
        }, 3000);

        const legCnt = parseInt(legs);
        this.enableRow[legCnt - 1] = 'yes';
        console.log("item len=>", legs)
      }
      else if (response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })

  }



}
