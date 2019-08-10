import { Component, OnInit} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordComponent } from 'src/app/common/reset-password/reset-password.component';


@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
  providers: [NgbModal, NgbModalConfig]
})
export class DashbordComponent implements OnInit {

  closeResult: string;

  constructor(private config: NgbModalConfig, private modalService: NgbModal) {
               
   }
  handle(e){
    console.log("customer",e)
    this.closeResult = e;
}
  ngOnInit() {
   this.modalopen();
  }
  modalopen() {
    this.modalService.open(ResetPasswordComponent);
  }
}
