import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-excelupload',
  templateUrl: './excelupload.component.html',
  styleUrls: ['./excelupload.component.css'],
  providers: [NgbModal, NgbModalConfig, NgbTooltipConfig],
  encapsulation: ViewEncapsulation.None,
})
export class ExceluploadComponent implements OnInit {
  @ViewChild('submitConfirm', { static: false }) submitConfirm: TemplateRef<any>;
  filename: any;
  rownum = 1;
  errorMsg: any;
  msg: any;
  dataset: any[] = [];
  tabledata: any;
  id = 'hotInstance';
  flag: boolean = true;
  private hotRegisterer = new HotTableRegisterer();

  markingTestTempArray = [];
  lineitemId: any;
  params: any;
  oid: any;
  sheets: any;
  constructor(private objService: LappRestService, private router: Router, private modalService: NgbModal,
    private config: NgbTooltipConfig) {
    config.triggers = 'click';
  }

  ngOnInit() {
    this.oid = localStorage.getItem('oid');
    this.lineitemId = JSON.parse(localStorage.getItem('lineitemid'));

    let dataObj = [{ L: "", R: "", O: "" }]

    this.getExceldata(null)
  }

  getExceldata(dataObj) {
    //  dataObj=[];
    // this.dataset = dataObj;
    if (dataObj) {
      dataObj.forEach(element => {
        this.dataset.push({ 'L': element['Left Marking Text (L)'], 'O': element['Others (O)'], 'R': element['Right Marking Text  (R)'], })
      });
    }
  }

  goPrevious() {
    this.router.navigate(['customer/neworders', this.oid])
  }

  OnLoadFile(ev) {
    this.dataset = [];
    this.filename = '';
    this.filename = ev.target.files[0].name
    const reader = new FileReader();
    let workBook = null;
    let jsonData = null;
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      //   jsonData = workBook.SheetNames.reduce((initial, name) => {
      //     const sheet = workBook.Sheets[name];
      //     initial[name] = XLSX.utils.sheet_to_json(sheet);
      //     return initial;
      //   }, {});
      //   const dataString = JSON.stringify(jsonData);

      //   let dataObj=JSON.parse(dataString);
      this.sheets = <any>XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
      this.getExceldata(this.sheets)
      // this.rownum=dataObj.length;
      //this.setDownload(dataString);
    }
    reader.readAsBinaryString(file);
  }

  saveData() {
    this.tabledata = this.hotRegisterer.getInstance(this.id).getData();
    let harray = [];
    this.tabledata.forEach(element => {
      harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] })
    });
    const lineitemId = localStorage.getItem('lineitemid');
    const legs = harray.length;
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');

    for (let i = 0; i < harray.length; i++) {
      this.markingTestTempArray.push({
        "leftText": harray[i].leftText,
        "rightText": harray[i].middleText,
        "middleText": harray[i].rightText,
        "notifyUser": "",
        "updatedBy": emailId,
        "textItemid": this.lineitemId
      })
    }
    this.params = {
      "lineItemId": this.lineitemId,
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
        setTimeout(() => {
          this.router.navigate(['customer/neworders', this.oid]);
        }, 2000);
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
    this.markingTestTempArray = [];
    const lineitemId = localStorage.getItem('lineitemid');
    let emailId = localStorage.getItem('username');
    const lineitemno = localStorage.getItem('lineItemNo');
    let harray = [];
    if (this.markingTestTempArray.length === 0) {
      this.tabledata = this.hotRegisterer.getInstance(this.id).getData();

      this.tabledata.forEach(element => {
        harray.push({ "leftText": element[0], "middleText": element[1], "rightText": element[2] })
      });

      const legs = harray.length;
      for (let i = 0; i < harray.length; i++) {
        this.markingTestTempArray.push({
          "leftText": harray[i].leftText,
          "rightText": harray[i].middleText,
          "middleText": harray[i].rightText,
          "notifyUser": "",
          "updatedBy": emailId,
          "textItemid": this.lineitemId
        })
      }
    }

    this.params = {
      "lineItemId": this.lineitemId,
      "isSubmit": true,
      "legsCount": harray.length,
      "emailId": emailId,
      "markingTextList": this.markingTestTempArray
    }
    this.objService.Post('addMarkingText', this.params).subscribe(response => {
      if (response.status === 200 && response.statusMessage === 'success') {
        this.msg = 'Marking Text Submitted Successfully';
        setTimeout(() => {
          this.msg = '';
        }, 3000);
        this.modalService.dismissAll();
        this.flag = false;
        setTimeout(() => {
          this.router.navigate(['customer/neworders', this.oid]);
        }, 5000);
      }
      else if (response.statusMessage === null || response.statusMessage === 'error') {
        this.errorMsg = response.errorMessage;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      }
    })
  }

  submitMarkingText() {
    this.modalService.open(this.submitConfirm)
  }
  downloadSample() {
    window.location.href = this.objService._BaseUrl + 'getSampleTemplate'
  }
}





