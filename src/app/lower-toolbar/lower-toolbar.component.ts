import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-lower-toolbar',
  templateUrl: './lower-toolbar.component.html',
  styleUrls: ['./lower-toolbar.component.css']
})
export class LowerToolbarComponent implements OnInit {

  beststore: string;
  constructor(private apiServ: ApiServiceService) {
    apiServ.listChanged.subscribe((x) => {
      if (apiServ.StoreList == null) {
        this.beststore = '';
        return;
      }
      let candidate = '';
      let canNum = -1;
      apiServ.StoreList.forEach(element => {
        const tmpval = this.getVal(element.remain_stat);
        if (tmpval > canNum) {
          candidate = element.name;
          canNum = tmpval;
        }
      });
      this.beststore = candidate;
    });
  }

  GetColor(stat: string) {
    if (stat === 'empty') {
      return '#000000';
    } else if (stat === 'few') {
      return '#FF0000';
    } else if (stat === 'some') {
      return '#FFFF00';
    } else if (stat === 'plenty') {
      return '#00FF00';
    } else {
      return '#FFFFFF';
    }
  }

  getVal(stat: string) {
    if (stat === 'empty') {
      return 0;
    } else if (stat === 'few') {
      return 1;
    } else if (stat === 'some') {
      return 2;
    } else if (stat === 'plenty') {
      return 3;
    } else {
      return -99;
    }
  }

  ngOnInit() {
  }

}
