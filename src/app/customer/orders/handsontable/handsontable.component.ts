import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import { Route, Router } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AppConfig } from '../../../configs/app.config';
const URL = AppConfig.endpoints.baseUrl + `/uploadOrderStatus`;

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
  fd = new FormData();
  file: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'orderData' });
  rownum: any;
  editObj = { "leftmarking": "", "rightmarking": "", "middlemarking": "", "rmPartnoLeft":"", "rmPartnoRight":"", "rmPartnomiddle":"","markingId": "" }
  deleteData: any;
  legsCount: any;
  tabledata: any;
  msg: string;
  errorMsg: string;
  firsttime: number = 1;
  errorMessage: string;
  flag: number = 1;
  id = 'hotInstance';
  colmin = 6;
  title = 'sampledemo';
  col = ['L', 'R', 'O','rmPartnoLeft','rmPartnoRight','rmPartnomiddle'];
  enableRow = []
  columns: object[] = [
    { data: 'L', title: 'L: Left Text' },
    { data: 'R', title: 'R: Right Text' },
    { data: 'O', title: 'O: Others' },
    { data:'rmPartnoLeft', title:'RM Part No L'},
    { data:'rmPartnoRight', title:'RM Part No R'},
    { data:'rmPartnomiddle', title:'RM Part No O'}
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
  markinglistlength: any;
  markingtextId: any;
  lineitemno: any;
  lineitemId: number;
  emailId: any;
  isDisable = false;
  oid: any;
  headingFlag = 0;
  submitDisable = false;
  constructor(private router: Router, private fb: FormBuilder, private objService: LappRestService, private modalService: NgbModal,
    private translate: TranslateService) {

  }

  ngOnInit() {
    this.oid = localStorage.getItem('oid');
    this.legsCount = localStorage.getItem('legsno');
    this.rownum = this.legsCount;
    this.lineitemno = localStorage.getItem('lineItemNo');
    this.lineitemId = parseInt(localStorage.getItem('lineitemid'));
    this.emailId = localStorage.getItem('username');
    if (parseInt(localStorage.getItem('submitflag')) === 0) {
      this.flag = 0;
      this.isDisable = true;
    }
    else {
      this.flag = 1
      this.isDisable = false;
    }
    if(parseInt(localStorage.getItem('viewFlag')) === 1) {
      this.flag = 0;
      this.headingFlag = 1
      this.isDisable = true;
    }
    this.getMarkingTextDetails();

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.msg = '';
      this.errorMsg = '';
      let latestFile = this.uploader.queue[this.uploader.queue.length - 1]
      this.uploader.queue = [];
      this.uploader.queue.push(latestFile);
    };

    this.uploader.onSuccessItem = (item: any, response: string, status: any, headers: any) => {
      this.msg = '';
      this.errorMsg = '';
      let data = JSON.parse(response);
      if (data.status === 200 && data.statusMessage === "success") {
        this.msg = "show";
        setTimeout(() => {
          this.msg = '';
        }, 3000);

      } else if (data.statusMessage == "error") {
        this.errorMsg = "show";
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }

      this.uploader.clearQueue();

      this.uploader.options.additionalParameter = {

      };

    }
  }

  onUpload() {
    this.uploader.uploadAll();
  }

  public onFileSelected() {
    this.fd.append('file', this.file);
  }

  removeFile(item) {
    this.uploader.removeFromQueue(item);
  }
  addMarkingTextApi(params) {
    this.objService.Post('addMarkingText', params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = response.successMessage;
        setTimeout(() => {
          this.msg = '';
        }, 3000);
        if (this.firsttime === 0) {
          this.getMarkingTextDetails();
        }
      }
      else if (response.statusMessage === null || response.statusMessage === 'error' || response.errorMessage === 'Invalid request..!') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
  }
  updateMarkingTextApi(params) {
    this.objService.Post('updateMarkingText', params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = this.translate.instant('updateMessage');
        this.getMarkingTextDetails();
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
  }
  getMarkingTextDetails() {

    let Params = {
      "lineItemid": this.lineitemId
    }
    this.objService.Get('getMarkingText', Params).subscribe(response => {
      this.markingtextId = response.markingTextList;
      this.markinglistlength = response.markingTextList.length;
      if (response.markingTextList.length === 0 && this.firsttime) {
        this.firsttime = 1;
        this.rownum = this.legsCount;
      }
      else {
        this.firsttime = 0;
        for (let i = 0; i <= this.markinglistlength; i++) {
          this.enableRow[i] = 'yes';
        }
        this.markingTextForm = this.fb.group({
          arr: this.fb.array([])
        });

        this.items = [];
        this.rownum = this.legsCount;
        for (let objRow of response.markingTextList) {
          objRow["cIsNew"] = false;
          this.items.push(objRow);
        }
        this.items = this.items.sort((a, b) => a.markingId - b.markingId);
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
          rmPartnoLeft:[x.rmPartnoLeft],
          rmPartnoRight:[x.rmPartnoRight],
          rmPartnomiddle:[x.rmPartnomiddle],
          markingId: [x.markingId],
        }))
      )
    })
  }

  saveData() {
    this.submitDisable = true;
    this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
    let harray = [];
    this.tabledata.forEach(element => {
      harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2], "rmPartnoLeft": element[3], "rmPartnoRight": element[4], "rmPartnomiddle": element[5] })
    });
    for (let i = 0; i < harray.length; i++) {
      this.markingTestTempArray.push({
        "leftText": harray[i].leftText,
        "rightText": harray[i].middleText,
        "middleText": harray[i].rightText,
        "rmPartnoLeft": harray[i].rmPartnoLeft,
        "rmPartnoRight": harray[i].rmPartnoRight,
        "rmPartnomiddle": harray[i].rmPartnomiddle,
        "notifyUser": "",
        "updatedBy": this.emailId,
        "textItemid": this.lineitemId
      })
    }
    this.params = {
      "lineItemId": this.lineitemId,
      "isSubmit": false,
      "legsCount": harray.length,
      "emailId": this.emailId,
      "markingTextList": this.markingTestTempArray
    }

    this.addMarkingTextApi(this.params);

    let Params = {
      "lineItemid": this.lineitemId
    }
    this.objService.Get('getMarkingText', Params).subscribe(response => {
      this.markingtextId = response.markingTextList;
    })
    setTimeout(() => {
      this.router.navigate(['customer/neworders', this.oid]);
  }, 3000); 
  }

  submitData() {
    this.modalService.open(this.submitConfirm);
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

    let params = {
      "lineItemId": this.lineitemId,
      "isSubmit": false,
      "emailId": this.emailId,
      "legsCount": this.legsCount,
      "markingId": this.deleteData.markingId,
      "leftText": "",
      "rightText": "",
      "middleText": "",
      "rmPartnoLeft":"",
      "rmPartnoRight":"",
      "rmPartnomiddle":""
    }
    this.updateMarkingTextApi(params);
    this.modalService.dismissAll();
  }

  openModel(markingTextForm) {
    this.values = markingTextForm.arr;
    this.modalService.open(this.submitConfirm);
  }

  submitMarkingText() {

    if (this.markingtextId.length === 0) {
      let harray = [];
      this.markingTestTempArray = [];
      this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
      this.tabledata.forEach(element => {
        harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] , "rmPartnoLeft": element[3], "rmPartnoRight": element[4], "rmPartnomiddle": element[5]})
      });
      for (let i = 0; i < harray.length; i++) {
        this.markingTestTempArray.push({
          "leftText": harray[i].leftText,
          "rightText": harray[i].middleText,
          "middleText": harray[i].rightText,
          "rmPartnoLeft": harray[i].rmPartnoLeft,
          "rmPartnoRight": harray[i].rmPartnoRight,
          "rmPartnomiddle":harray[i].rmPartnomiddle,
          "notifyUser": "",
          "updatedBy": this.emailId,
          "textItemid": this.lineitemId
        })
      }
      this.params = {
        "lineItemId": this.lineitemId,
        "isSubmit": true,
        "legsCount": harray.length,
        "emailId": this.emailId,
        "markingTextList": this.markingTestTempArray
      }
      this.addMarkingTextApi(this.params);
      this.modalService.dismissAll();
    }
    else {
      this.markingTestTempArray = [];
      this.params = {
        "lineItemId": this.lineitemId,
        "isSubmit": true,
        "legsCount": this.legsCount,
        "emailId": this.emailId,
        "markingTextList": this.markingTestTempArray
      }
      this.addMarkingTextApi(this.params);
      this.modalService.dismissAll();
    }
    this.flag = 0;
    this.isDisable = true;
    setTimeout(() => {
      this.router.navigate(['customer/neworders', this.oid]);
  }, 5000); 
  }

  editMarkText(i, row) {
    this.editObj.rightmarking = row.rightText
    this.editObj.leftmarking = row.leftText
    this.editObj.middlemarking = row.middleText;
    this.editObj.rmPartnoLeft = row.rmPartnoLeft,
    this.editObj.rmPartnoRight = row.rmPartnoRight,
    this.editObj.rmPartnomiddle = row.rmPartnomiddle,
    this.editObj.markingId = row.markingId
    this.modalService.open(this.editModel);
  }

  updateMarkingTextData() {

    let params = {
      "textItemid": this.lineitemId,
      "isSubmit": false,
      "emailId": this.emailId,
      "legsCount": this.legsCount,
      "markingId": this.editObj.markingId,
      "leftText": this.editObj.leftmarking,
      "rightText": this.editObj.rightmarking,
      "middleText": this.editObj.middlemarking,
      "rmPartnoLeft": this.editObj.rmPartnoLeft,
      "rmPartnoRight": this.editObj.rmPartnoRight,
      "rmPartnomiddle": this.editObj.rmPartnomiddle

    }
    this.updateMarkingTextApi(params);
    this.modalService.dismissAll();

  }

  getColumns = (column) => {
    return this.columns[column];
  };

  goPrevious() {
    this.router.navigate(['customer/neworders', this.oid]);
  }

  addNewRow() {
    this.legsCount = this.items.length + 1;
    let objNewRow = {
      "leftText": '',
      "rightText": '',
      "middleText": '',
      "notifyUser": "",
      "updatedBy": this.emailId,
      "textItemid": this.lineitemId,
      "cIsNew": true
    }
    this.enableRow[this.items.length] = 'no';
    this.items.push(objNewRow);
    this.blnShowSaveNewRowButton = true;
    this.setFormArray();

  }

  onClickSaveNewRow() {

    let arrNewRow = [];
    const values = this.markingTextForm.value.arr;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]["cIsNew"] == true) {
        arrNewRow.push({
          "leftText": values[i].leftText,
          "rightText": values[i].rightText,
          "middleText": values[i].middleText,
          "rmPartnoLeft": values[i].rmPartnoLeft,
          "rmPartnoRight": values[i].rmPartnoRight,
          "rmPartnomiddle": values[i].rmPartnomiddle,
          "notifyUser": "",
          "updatedBy": this.emailId,
          "textItemid": this.lineitemId
        })
      }
    }
    this.params = {
      "lineItemId": this.lineitemId,
      "isSubmit": false,
      "legsCount": this.legsCount,
      "emailId": this.emailId,
      "markingTextList": arrNewRow
    }
    this.addMarkingTextApi(this.params);
    this.blnShowSaveNewRowButton = false;
    const legCnt = parseInt(this.legsCount);
    this.enableRow[legCnt - 1] = 'yes';

  }

}
