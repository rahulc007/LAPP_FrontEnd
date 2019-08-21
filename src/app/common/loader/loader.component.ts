import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';
//import {LoaderState} from './base.class'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) {
    this.subscription = this.loaderService.getStatus().subscribe((value: boolean) => {
      this.show = value;
    })
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}