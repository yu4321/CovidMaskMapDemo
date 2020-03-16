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

  getColorStringbyStatus(stat: string): string {
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

  getSColorStringbyStatus(stat: string): string {
    if (stat === 'empty') {
      return '#545454';
    } else if (stat === 'few') {
      return '#FF6666';
    } else if (stat === 'some') {
      return '#FFFF66';
    } else if (stat === 'plenty') {
      return '#66FF66';
    } else {
      return '#E3E3E3';
    }
  }

  getValByStringbyStatus(stat: string): number {
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
}
