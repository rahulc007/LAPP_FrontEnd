import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import { Route, Router } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';


const URL = `http://3.17.182.133:8090/uploadOrderStatus`;

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
  markinglistlength: any;
  markingtextId: any;
  lineitemno: any;
  lineitemId: any;
  emailId: any;
  constructor(private router: Router, private fb: FormBuilder, private objService: LappRestService, private modalService: NgbModal,
    private translate: TranslateService) {

  }

  ngOnInit() {
    this.legsCount = localStorage.getItem('legsno');
    this.rownum = this.legsCount;
    this.lineitemno = localStorage.getItem('lineItemNo');
    this.lineitemId = localStorage.getItem('lineitemid');
    this.emailId = localStorage.getItem('username');
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
      "lineItemid": this.lineitemno
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
    for (let i = 0; i < harray.length; i++) {
      this.markingTestTempArray.push({
        "leftText": harray[i].leftText,
        "rightText": harray[i].middleText,
        "middleText": harray[i].rightText,
        "notifyUser": "",
        "updatedBy": this.emailId,
        "lineItemnumber": this.lineitemno
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
      "lineItemid": this.lineitemno
    }

    this.objService.Get('getMarkingText', Params).subscribe(response => {
      this.markingtextId = response.markingTextList;
    })
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
      "middleText": ""
    }
    this.updateMarkingTextApi(params);
    this.modalService.dismissAll();
  }

  openModel(markingTextForm) {
    this.values = markingTextForm.arr;
    this.modalService.open(this.submitConfirm);
  }

  submitMarkingText() {
    this.getMarkingTextDetails();
    let passed = true;
    if (this.values) {
      for (let i = 0; i < this.markingtextId.length; i++) {
        this.params = {
          "lineItemId": this.lineitemId,
          "isSubmit": true,
          "legsCount": this.legsCount,
          "emailId": this.emailId,
          "markingId": this.markingtextId[i].markingId,
          "leftText": this.values[i].leftText,
          "rightText": this.values[i].rightText,
          "middleText": this.values[i].middleText
        }

        this.objService.Post('updateMarkingText', this.params).subscribe(response => {
          if (response.statusMessage === 'error') {
            passed = false
          }
        })
      }
      if (passed) {
        this.msg = 'Marking Text Updated Successfully';
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      }
      else {
        this.errorMsg = 'Marking Text Updation failed';
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
      this.modalService.dismissAll();
    }

    else {
      if (this.markingtextId.length !== 0) {
        let harray = [];
        this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
        this.tabledata.forEach(element => {
          harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] })
        });
        for (let i = 0; i < harray.length; i++) {
          this.params = {
            "lineItemId": this.lineitemId,
            "isSubmit": true,
            "legsCount": harray.length,
            "emailId": this.emailId,
            "markingId": this.markingtextId[i].markingId,
            "leftText": harray[i].leftText,
            "rightText": harray[i].rightText,
            "middleText": harray[i].middleText
          }
          this.objService.Post('updateMarkingText', this.params).subscribe(response => {
            if (response.statusMessage === 'error') {
              passed = false
            }
          })
        }
        if (passed) {
          this.msg = 'Marking Text Updated Successfully';
          setTimeout(() => {
            this.msg = '';
          }, 3000);
        }
        else {
          this.errorMsg = 'Marking Text Updation failed';
          setTimeout(() => {
            this.errorMsg = '';
          }, 3000);
        }
        this.modalService.dismissAll();
      }
      else {
        let harray = [];
        this.markingTestTempArray = [];
        this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
        this.tabledata.forEach(element => {
          harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] })
        });
        for (let i = 0; i < harray.length; i++) {
          this.markingTestTempArray.push({
            "leftText": harray[i].leftText,
            "rightText": harray[i].middleText,
            "middleText": harray[i].rightText,
            "notifyUser": "",
            "updatedBy": this.emailId,
            "lineItemnumber": this.lineitemno
          })
        }
        this.params = {
          "lineItemId": this.lineitemId,
          "isSubmit": true,
          "legsCount": harray.length,
          "emailId": this.emailId,
          "markingTextList": this.markingTestTempArray
        }
        this.addMarkingTextApi(this.params)
        this.modalService.dismissAll();
      }
    }
    this.flag = 0;
  }

  editMarkText(i, row) {
    this.editObj.rightmarking = row.rightText
    this.editObj.leftmarking = row.leftText
    this.editObj.middlemarking = row.middleText;
    this.editObj.markingId = row.markingId
    this.modalService.open(this.editModel);
  }

  updateMarkingTextData() {

    let params = {
      "lineItemId": this.lineitemId,
      "isSubmit": false,
      "emailId": this.emailId,
      "legsCount": this.legsCount,
      "markingId": this.editObj.markingId,
      "leftText": this.editObj.leftmarking,
      "rightText": this.editObj.rightmarking,
      "middleText": this.editObj.middlemarking

    }
    this.updateMarkingTextApi(params);
    this.modalService.dismissAll();

  }

  getColumns = (column) => {
    return this.columns[column];
  };

  goPrevious() {
    this.router.navigate(['customer/orderview/:id'])
  }

  addNewRow() {
    this.legsCount = this.items.length + 1;
    let objNewRow = {
      "leftText": '',
      "rightText": '',
      "middleText": '',
      "notifyUser": "",
      "updatedBy": this.emailId,
      "lineItemnumber": this.lineitemno,
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
          "notifyUser": "",
          "updatedBy": this.emailId,
          "lineItemnumber": this.lineitemno
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
