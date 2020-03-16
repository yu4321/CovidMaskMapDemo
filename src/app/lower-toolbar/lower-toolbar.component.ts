import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-lower-toolbar',
  templateUrl: './lower-toolbar.component.html',
  styleUrls: ['./lower-toolbar.component.css']
})
export class LowerToolbarComponent implements OnInit {

  constructor(private apiServ: ApiServiceService) {
  }

  ngOnInit() {
  }

}
