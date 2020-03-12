/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterContentInit {

  @ViewChild('gmap', {static: true}) gmapElement: any;
  curCoorText: string;
  map: google.maps.Map;
  latitude: any;
  longitude: any;
  constructor() { }

  ngOnInit() {
    this.curCoorText = '';
    // alert('map inited');
  }
  ngAfterContentInit() {
    const mapProp = {
      center: new google.maps.LatLng(37.5793, 127.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.addListener('center_changed', ( ) => {
      const curCenter = this.map.getCenter();
      this.setXY(curCenter.lat(), curCenter.lng());
    });
    // alert('map init after');
  }

  setXY(x: number, y: number) {
    this.curCoorText = '위도 : ' + x + ', 경도 : ' + y;
  }

  searchCommand() {

  }
}
