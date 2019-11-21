import { Component, OnInit, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { NgxEasyTableComponent } from '../../common/ngx-easy-table/ngx-easy-table.component';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { AppConfig } from '../../configs/app.config';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { userTypes } from '../../common/constants/constants';
import * as XLSX from 'xlsx';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { NgbModal, NgbModalConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
const URL = AppConfig.endpoints.baseUrl + `/uploadOrderStatus`;
@Component({
  selector: 'app-upload-status',
  templateUrl: './upload-status.component.html',
  styleUrls: ['./upload-status.component.css'],
  providers: [ConfigurationService, NgbModal, NgbModalConfig, NgbTooltipConfig],
  encapsulation: ViewEncapsulation.None
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
  emailId: any;
  errMsg: string;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'orderData' });

  constructor(private objService: LappRestService, private config: NgbTooltipConfig,
    private modalService: NgbModal) {
    this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
    this.configuration.paginationEnabled = true;
    config.triggers = 'click';
  }

  ngOnInit() {
    this.emailId = localStorage.getItem('username');
     this.getUploadedStatus();
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
        this.errMsg = data.errorMessage;
        setTimeout(()=> {
          this.errorMsg ='';
     }, 3000);
      }
      
      this.uploader.clearQueue();
     this.getUploadedStatus();
    };

    this.currentuser = localStorage.getItem('username')

    this.uploader.options.additionalParameter = {
      emailId: this.currentuser
    };
    this.columns = [
      { key: 'fileName', title: 'File Name' },
      { key: 'fileSize', title: 'File Size' },
      { key: 'createdUser', title: 'Created User' },
      { key: 'createdDate', title: 'Created Date' },
      { key:'fileStatus', title:'File Status', searchEnabled: false}
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
  getUploadedStatus() {
  
      this.params = {
        'emailId': this.emailId 
      }
      this.objService.Get('getOrderStatusByUser', this.params).subscribe(res => {
        console.log('resp', res);
        this.data = res.orderStatusList
      });
    }
   
 
  

}
