import { Component, OnInit , ViewChild, TemplateRef} from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import {Router} from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LappRestService } from '../../../core/rest-service/LappRestService';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-excelupload',
  templateUrl: './excelupload.component.html',
  styleUrls: ['./excelupload.component.css']
})
export class ExceluploadComponent implements OnInit {
  @ViewChild('submitConfirm', { static: false }) submitConfirm: TemplateRef<any>;
  filename:any;
  rownum=1;
  errorMsg:any;
  msg:any;
  dataset:any;
  tabledata: any;
  id = 'hotInstance';
  
  private hotRegisterer = new HotTableRegisterer();
    
  markingTestTempArray = [];
  lineitemId:any;
  params: any;
  constructor(private objService: LappRestService, private router:Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.lineitemId=localStorage.getItem('lineitemid');

    let dataObj=[{L:"",R:"",O:""}]

    this.getExceldata(dataObj)
  }

  getExceldata(dataObj)
  {
    
    this.dataset = dataObj;

 }

 goPrevious() {
  this.router.navigate(['customer/orderview/:id'])
}

  OnLoadFile(ev) {

    this.filename= ev.target.files[0].name
    const reader = new FileReader();
    let workBook = null;
    let jsonData = null;
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);

      let dataObj=JSON.parse(dataString);
     
      
  this.getExceldata(dataObj.Sheet1)
      this.rownum=this.dataset.length;
      console.log("list=>", this.dataset);
      console.log("len=>", this.rownum)
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
            "lineItemnumber": lineitemno
          })
        }
        this.params = {
          "lineItemId":  this.lineitemId,
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
        this.markingTestTempArray=[];
        const lineitemId = localStorage.getItem('lineitemid');
        console.log("line item id=>", )

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
            this.modalService.dismissAll();
            setTimeout(() => {
              this.msg = '';
            }, 3000);
          //  this.modalService.open(this.submitConfirm);
          }
          else if (response.statusMessage === null || response.statusMessage === 'error') {
            this.errorMsg = response.errorMessage;
            setTimeout(() => {
              this.errorMsg = '';
            }, 3000);
          }
        })
      }
    
      submitMarkingText()
      {
        this.modalService.open(this.submitConfirm)
      }
  }


 


