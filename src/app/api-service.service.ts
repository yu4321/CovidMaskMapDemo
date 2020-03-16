import { Injectable, EventEmitter } from '@angular/core';
import { GeoJsonReq, GeoJsonModel } from './models/geoJsonModel';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private storeList: GeoJsonModel[];
  lastCenter: google.maps.LatLng;
  urlbase: string;

  get StoreList(): GeoJsonModel[] {
    return this.storeList;
  }
  set StoreList(val: GeoJsonModel[]) {
    this.storeList = val;
    this.listChanged.emit(true);
  }

  listChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {
    this.urlbase = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?';
   }

  searchStores(param: GeoJsonReq): Promise<Array<GeoJsonModel>> {
    this.lastCenter = new google.maps.LatLng(param.lat, param.lng);
    let currentUrl = this.urlbase;
    currentUrl += `lat=${param.lat}`;
    currentUrl += `&lng=${param.lng}`;
    currentUrl += `&m=${param.m}`;
    console.log('sending url: ' + currentUrl);
    return fetch(currentUrl).then((x) => {
      console.log('get fetch complete');
      return x.json();
    }).then((res) => {
      if (res.count > 0) {
      const model: Array<GeoJsonModel> = res.stores;
      this.StoreList = model;
      return model;
      } else {
        this.StoreList = null;
        return null;
      }
    });
  }

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
