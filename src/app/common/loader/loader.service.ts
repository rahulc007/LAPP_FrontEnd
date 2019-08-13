import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
//import {LoaderState} from './base.class'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject();
 
  constructor() { }
  show() {
    this.loaderSubject.next(true);
  }
  hide() {
    this.loaderSubject.next(false);
  }
  getStatus():Observable<any>{
      return this.loaderSubject.asObservable();
  }
}
