import { Component, OnInit, EventEmitter  } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
 const URL = 'http://localhost:9000/api/integration-api/fileupload';
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

  fd = new FormData();
  configuration: any;
  file:File;
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'file'});
  

  constructor() { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
        
     };
     this.uploader.options.additionalParameter = {
      layoutId: 10,
      userId: 1
  };
  }

  onUpload() {
    
    this.uploader.uploadAll();
    }

public onFileSelected() {
 // const file: File = event[0];

  console.log("file==>",this.uploader.queue);

  this.fd.append('file', this.file);

}



clearSelectedPicture() {
  
}

removeFile(item) {
  this.uploader.removeFromQueue(item);
  //this.clearSelectedPicture();
}


}
