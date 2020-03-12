import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private storeList: any;
  get StoreList() {
    return this.storeList;
  }
  set StoreList(val: any) {
    this.storeList = val;
    this.listChanged.emit(true);
  }

  listChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }
}
