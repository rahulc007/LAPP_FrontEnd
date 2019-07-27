import { Component, OnInit } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';

@Component({
  selector: 'app-handsontable',
  templateUrl: './handsontable.component.html',
  styleUrls: ['./handsontable.component.css']
})
export class HandsontableComponent implements OnInit {
  private hotRegisterer = new HotTableRegisterer();
  rownum:any;
  id = 'hotInstance';
  colmin=3;
  title = 'sampledemo';
  col= ['L', 'R', 'O'];

  columns: object[] = [
    {data: 'L', title: 'L'}, 
    {data: 'R', title: 'R'},
    {data: 'O', title: 'O'},
  ];
  data: any;
  constructor() { }

  ngOnInit() {

    this.rownum = sessionStorage.getItem('rownum');

  }

  mydata(){
    var tabledata = this.hotRegisterer.getInstance(this.id).getData();
    console.log("handson table ==>",tabledata)
}

getColumns = (column) => {
  return this.columns[column];
};

}
