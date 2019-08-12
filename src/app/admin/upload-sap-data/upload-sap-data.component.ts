import { Component, OnInit, EventEmitter, ViewChild  } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
 const URL = `http://3.17.182.133:8090/uploadSAPData`;
import {NgxEasyTableComponent} from '../../common/ngx-easy-table/ngx-easy-table.component';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import {AppConfig} from '../../configs/app.config';
import { LappRestService  } from '../../core/rest-service/LappRestService';
//const URL= AppConfig.endpoints.uploadApi;
@Component({
  selector: 'app-upload-sap-data',
  templateUrl: './upload-sap-data.component.html',
  styleUrls: ['./upload-sap-data.component.css'],
  providers:[ConfigurationService]
})
export class UploadSapDataComponent implements OnInit {
  @ViewChild('uploadFile',{static:false}) uploadFile:any;
  fd = new FormData();
  configuration: any;
  currentuser:any;
  file:any;
  orderData:any;
  params: any = '';
  public columns: any[] = [];
  public data :any[]=[];
  msg: string = '';
  errorMsg: string = '';


  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'orderData'});
  

  constructor(private objService: LappRestService) {
    this.configuration = ConfigurationService.config; 
   }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    //      console.log('ImageUpload:uploaded:', item, status, response);
    //     //  this.uploadFile.nativeElement.value = '';
    //     this.getUploadedData();
    //  };
     this.uploader.onSuccessItem = (item: any, response: string, status: any, headers: any) => {
      let data = JSON.parse(response);
      // console.log('ImageUpload:uploaded===:', item,"===", status, "===", response, "===", data.status);
     //  this.uploadFile.nativeElement.value = '';
     if(data.status == 200){
       this.msg = "show";
       this.getUploadedData();
     } else if(data.status == 500){
      this.errorMsg = "show";
     }
     this.uploader.clearQueue();  
     this.getUploadedData();
  };
  
this.currentuser = localStorage.getItem('username')

     this.uploader.options.additionalParameter = {
      emailId:this.currentuser
  };
  this.getUploadedData();
  this.columns = [
    { key: 'fileName', title: 'File Name' },
    { key: 'fileSize', title: 'File Size' },
    { key: 'orderCount', title: 'Order Count' },
    { key: 'uploadedBy', title: 'Uploaded By'},
    { key: 'createdDate', title: 'Created Date'}
  ]
  }
  getUploadedData() {

    const userType = localStorage.getItem('userType');

    if(userType == 1)
    {
    this.objService.Get('getSapFileInfo', this.params).subscribe( res=> {
      this.data=res.sapFileInofList;
  
    });
  }
  else if(userType == 2)
  {
    const emailId = localStorage.getItem('username');
    this.objService.Get('getSapFileInfoByUser?emailId='+emailId).subscribe( res=> {
      this.data=res.sapFileInofList;
  
    });
  }
  }
 
  onUpload() {
    
    this.uploader.uploadAll();
    
    }

public onFileSelected() {
 // const file: File = event[0];

  console.log("file==>",this.file);

  this.fd.append('file', this.file);

}



clearSelectedPicture() {
  
}

removeFile(item) {
  this.uploader.removeFromQueue(item);
  //this.clearSelectedPicture();
}


}
