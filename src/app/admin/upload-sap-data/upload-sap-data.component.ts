import { Component, OnInit, EventEmitter, ViewChild  } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
 const URL = `http://3.17.182.133:8090/uploadSAPData`;
import {NgxEasyTableComponent} from '../../common/ngx-easy-table/ngx-easy-table.component';
import {ConfigurationService} from '../../common/ngx-easy-table/config-service';
import {AppConfig} from '../../configs/app.config';
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
  file:any;
  orderData:any;
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'orderData'});
  

  constructor() { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
        //  this.uploadFile.nativeElement.value = '';
        
         
     };

     this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
     //  this.uploadFile.nativeElement.value = '';
     this.uploader.clearQueue();
      
  };
     this.uploader.options.additionalParameter = {
     
  };
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
