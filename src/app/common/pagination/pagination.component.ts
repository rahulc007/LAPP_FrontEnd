
import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

 // @Input() pager:number;
 page = 1;
  @Output() clicked = new EventEmitter<number>();
  constructor() { }

  ngOnInit()
  {

  }

  loadPage(pno:number){  
    this.clicked.emit(pno);  
    } 
  
}


