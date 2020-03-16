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
        const tmpval = apiServ.getValByStringbyStatus(element.remain_stat);
        if (tmpval > canNum) {
          candidate = element.name;
          canNum = tmpval;
        }
      });
      this.beststore = candidate;
    });
  }

  ngOnInit() {
  }

}
