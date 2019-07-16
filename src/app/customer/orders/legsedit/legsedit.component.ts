import { Component, OnInit } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';

@Component({
  selector: 'app-legsedit',
  templateUrl: './legsedit.component.html',
  styleUrls: ['./legsedit.component.css']
})
export class LegseditComponent implements OnInit {

  rownum:any;
  colmin=3;
  title = 'sampledemo';
  col= ['L', 'R', 'O'];
  data: any;
  private hotRegisterer = new HotTableRegisterer();

  id = 'hotInstance';

  constructor() { }

  ngOnInit() {
  }

  
  mydata(){
    var tabledata = this.hotRegisterer.getInstance(this.id).getData();
    console.log("handson table ==>",tabledata)
}

getrow(row)
{
console.log("row value===>",row)
this.rownum =row
}

}
