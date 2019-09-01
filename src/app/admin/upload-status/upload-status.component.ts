import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
const URL = `http://3.17.182.133:8090/uploadOrderStatus`;
import { NgxEasyTableComponent } from '../../common/ngx-easy-table/ngx-easy-table.component';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { AppConfig } from '../../configs/app.config';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { userTypes } from '../../common/constants/constants';
import * as XLSX from 'xlsx';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
@Component({
  selector: 'app-upload-status',
  templateUrl: './upload-status.component.html',
  styleUrls: ['./upload-status.component.css'],
  providers: [ConfigurationService]
})
export class UploadStatusComponent implements OnInit {

  @ViewChild('uploadFile', { static: false }) uploadFile: any;

  isAdmin = 0;
  fd = new FormData();
  configuration: any;
  currentuser: any;
  file: any;
  orderData: any;
  params: any = '';
  public columns: any[] = [];
  public data: any[] = [];
  msg: string = '';
  errorMsg: string = '';
  sapData: any;
  fileStatus:boolean;
  
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'orderData' });

  constructor(private objService: LappRestService) {
    this.configuration = DefaultConfig;
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
    file.withCredentials = false;
      this.msg = '';
      this.errorMsg = '';
      let latestFile = this.uploader.queue[this.uploader.queue.length-1]
      this.uploader.queue = []; 
      this.uploader.queue.push(latestFile);
    };

    this.uploader.onSuccessItem = (item: any, response: string, status: any, headers: any) => {
      this.msg = '';
      this.errorMsg = '';
      let data = JSON.parse(response);
      if (data.status === 200 && data.statusMessage === "success") {
        this.msg = "show";
        setTimeout(()=> {
          this.msg ='';
     }, 3000);
       
      } else if (data.statusMessage == "error") {
        this.errorMsg = "show";
        setTimeout(()=> {
          this.errorMsg ='';
     }, 3000);
      }
      
      this.uploader.clearQueue();
     
    };

    this.currentuser = localStorage.getItem('username')

    this.uploader.options.additionalParameter = {
      emailId: this.currentuser
    };
    this.columns = [
      { key: 'fileName', title: 'File Name' },
      { key: 'fileSize', title: 'File Size' },
      { key: 'orderCount', title: 'Order Count' },
      { key: 'uploadedBy', title: 'Uploaded By' },
      { key: 'createdDate', title: 'Created Date' },
      { key:'fileStatus', title:'Upload Status', searchEnabled: false}
    ]
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
  
  

}
