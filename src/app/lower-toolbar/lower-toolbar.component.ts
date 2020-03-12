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
    apiServ.listChanged.subscribe((x)=>{
      let candidate = '';
      let canNum=-1;
      apiServ.StoreList.forEach(element => {
        let tmpval=this.getVal(element.remain_stat);
        if(tmpval > canNum){
          candidate=element.name;
          canNum = tmpval;
        }
      });
      this.beststore=candidate;
        //apiServ.StoreList
    });
  }

  getVal(stat: string){
    if(stat==='empty'){
      return 0;
    }
    if(stat==='few'){
      return 1;
    }
    if(stat==='some'){
      return 2;
    }
    if(stat==='plenty'){
      return 3;
    }
    else{
      return -99;
    }
  }

  ngOnInit() {
  }

}
