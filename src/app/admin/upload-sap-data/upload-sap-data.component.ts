import { Component, OnInit, EventEmitter, ViewChild, ViewEncapsulation, OnDestroy  } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { NgxEasyTableComponent } from '../../common/ngx-easy-table/ngx-easy-table.component';
import { ConfigurationService } from '../../common/ngx-easy-table/config-service';
import { AppConfig } from '../../configs/app.config';
import { LappRestService } from '../../core/rest-service/LappRestService';
import { userTypes } from '../../common/constants/constants';
import * as XLSX from 'xlsx';
import { NgbModal, NgbModalConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { LoaderService } from '../../common/loader/loader.service';
const URL = AppConfig.endpoints.baseUrl + `/uploadSAPData`;
@Component({
  selector: 'app-upload-sap-data',
  templateUrl: './upload-sap-data.component.html',
  styleUrls: ['./upload-sap-data.component.css'],
  providers: [ConfigurationService, NgbModal, NgbModalConfig, NgbTooltipConfig],
  encapsulation: ViewEncapsulation.None
})
export class UploadSapDataComponent implements OnInit, OnDestroy  {
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
  errMsg: any;
  showLoader = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'orderData' });

  constructor(private objService: LappRestService, private config: NgbTooltipConfig,
    private modalService: NgbModal, private loaderService: LoaderService) {
    this.configuration = DefaultConfig;
    this.configuration.searchEnabled = true;
    this.configuration.paginationEnabled = true;
    config.triggers = 'click';
  }

  ngOnInit() {
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
      this.setTimer();
      let data = JSON.parse(response);
      if (data.status === 200 && data.statusMessage === "success") {
        this.msg = "show";
        setTimeout(()=> {
          this.msg ='';
     }, 6000);
     
        this.getUploadedData();
      } else if (data.statusMessage == "error") {
        this.errorMsg = "show";
        this.errMsg = data.errorMessage;
        setTimeout(()=> {
          this.errorMsg ='';
     }, 6000);
      }
      
      this.uploader.clearQueue();
      this.getUploadedData();
    };

    this.currentuser = localStorage.getItem('username')

    this.uploader.options.additionalParameter = {
      emailId: this.currentuser
    };
    this.getUploadedData();
    this.columns = [
      { key: 'fileName', title: 'File Name', searchEnabled: true },
      { key: 'fileSize', title: 'File Size', searchEnabled: true },
      { key: 'orderCount', title: 'Order Count', searchEnabled: true },
      { key: 'uploadedBy', title: 'Uploaded By' , searchEnabled: true},
      { key: 'createdDate', title: 'Created Date', searchEnabled: true },
      { key:'fileStatus', title:'Upload Status', searchEnabled: false}
    ]
  }
 
setTimer(){
    this.showLoader   = true;
    this.timer = Observable.timer(1000);
    this.subscription = this.timer.subscribe(() => {
        this.showLoader = false;
    });
  }
ngOnDestroy() {
    if ( this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
  getUploadedData() {

    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));

    if (objUserDetails.userType === userTypes.superAdmin) {
      this.objService.Get('getSapFileInfo', this.params).subscribe(res => {
        this.data = res.sapFileInofList;
      });
    }
    else if (objUserDetails.userType === userTypes.admin) {
      this.isAdmin = 1;
      const emailId = localStorage.getItem('username');
      this.objService.Get('getSapFileInfoByUser?emailId=' + emailId, {}).subscribe(res => {
        this.data = res.sapFileInofList;
      });
    }
  }
 
  onUpload() {
    this.uploader.uploadAll();
  }

  downloadfile() {
    const emailId = localStorage.getItem('username');
    window.location.href = this.objService._BaseUrl + 'downloadSAPData?emailId=' + emailId;
  }

  public onFileSelected() {
    this.fd.append('file', this.file);
  }
  
  removeFile(item) {
    this.uploader.removeFromQueue(item);
  }
  
  checkStatus() {
    this.getUploadedData();
  }

}
