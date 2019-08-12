import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordComponent } from '../../common/reset-password/reset-password.component';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  showResetPopUp: boolean = false;
  @ViewChild('resetPWD1', { static: true }) resetPasswrod: any
  constructor(private modalService1: NgbModal) {
    let objUserDetails = JSON.parse(localStorage.getItem('currentUser'));
    this.showResetPopUp = objUserDetails.firstTimeLogin;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.showResetPopUp) {
      let xx = this.modalService1.open(ResetPasswordComponent, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }

}
