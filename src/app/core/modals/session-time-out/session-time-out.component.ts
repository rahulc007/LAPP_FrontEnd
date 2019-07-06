import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-time-out',
  templateUrl: './session-time-out.component.html',
  styleUrls: ['./session-time-out.component.scss']
})
export class SessionTimeOutComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
  }
  close() {
    this.activeModal.dismiss('Cross click');
    this.router.navigate(['/login']);
  }
}

