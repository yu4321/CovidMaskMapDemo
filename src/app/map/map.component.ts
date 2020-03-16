/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterContentInit, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { AppOffsetTopDirective } from '../app-offset-top.directive';
import { AppScrollableDirective } from '../app-scrollable.directive';
import { MatList } from '@angular/material/list';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  @ViewChild('storeList', {static: true}) storeList: any;
  curCoorText: string;
  map: google.maps.Map;
  places: any;
  latitude: any;
  longitude: any;
  selectedIndex: number;
  drewMarkers: Array<google.maps.Circle>;
  drewCircle: google.maps.Circle;
  drewInfos: Array<google.maps.InfoWindow>;
  zoom: any;

  searchZoom: number;
  @ViewChildren(AppOffsetTopDirective) listItems: QueryList<AppOffsetTopDirective>;
  @ViewChild(AppScrollableDirective) list: AppScrollableDirective;

  constructor(private apiService: ApiServiceService) { }

  ngOnInit() {
    this.curCoorText = '';
    this.searchZoom = 1000;
  }
  ngAfterContentInit() {
    const mapProp : google.maps.MapOptions = {
      center: new google.maps.LatLng(37.5793, 127.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI : true
    };
    this.drewMarkers = new Array<google.maps.Circle>();
    this.drewInfos = new Array<google.maps.InfoWindow>();
    navigator.geolocation.getCurrentPosition((x) => {
      this.map.setCenter(new google.maps.LatLng(x.coords.latitude, x.coords.longitude));
    });
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.addListener('center_changed', ( ) => this.recenter());
    this.recenter();
  }
  ngAfterViewInit(): void {
    console.log('afterviewinitCalled');
  }
  sliderChanged(x: any) {
    this.showSearchable();
  }

  recenter() {
    const curCenter = this.map.getCenter();
    this.latitude = curCenter.lat();
    this.longitude = curCenter.lng();
    this.zoom = this.map.getZoom();
    this.setXYText();
    this.showSearchable();
  }

  showSearchable() {
    if (this.drewCircle == null) {
      const color = '#000000';
      const circle = new google.maps.Circle({
        center: new google.maps.LatLng(this.latitude, this.longitude),
        radius: this.searchZoom,
        editable: false,
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.01,
        clickable: true
      });
      circle.setMap(this.map);
      this.drewCircle = circle;
    } else {
      const circle = this.drewCircle;
      circle.setRadius(this.searchZoom);
      circle.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    }
  }

  setXYText() {
    this.curCoorText = '위도 : ' + this.latitude + ', 경도 : ' + this.longitude + ', 확대율: ' + this.zoom;
  }

  searchCommand() {
    let urlbase = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?';
    urlbase += `lat=${this.latitude}`;
    urlbase += `&lng=${this.longitude}`;
    urlbase += `&m=${this.searchZoom}`;
    console.log('sending url: ' + urlbase);
    fetch(urlbase).then((x) => {
      console.log('get fetch complete');
      return x.json();
    }).then((res) => {
      if (res.count > 0) {
        console.log('start setter');
        this.places = res.stores;
        console.log('endsetter setter');
      } else {
        alert('결과 없음');
        this.places = null;
        this.apiService.StoreList = null;
        return;
      }
      console.log('start listmake');
      this.apiService.StoreList = this.places;
      this.MakeMarkers().then(() => {
        console.log('end listmake');
      });
    });
  }

  MakeMarkers() {
    console.log('start makemarker');
    this.drewMarkers.forEach((x) => x.setMap(null));
    this.drewInfos.forEach((x) => x.close());
    this.drewMarkers = [];
    this.drewInfos = [];
    this.places.forEach(element => {
      const fillcolor = this.apiService.getColorStringbyStatus(element.remain_stat);
      const strokecolor = this.apiService.getSColorStringbyStatus(element.remain_stat);
      const circle = new google.maps.Circle({
        center: new google.maps.LatLng(element.lat, element.lng),
        radius: 13,
        editable: false,
        strokeColor: fillcolor,
        fillColor: strokecolor,
        fillOpacity: 0.5,
        strokeWeight: 3
      });
      const info = new google.maps.InfoWindow({
        content: '<div><h2>' + element.name + '</h2><p>' + element.addr + '</p></div>'
      });
      circle.addListener('click', () => {
        info.setPosition(circle.getCenter());
        info.open(this.map);
        this.selectedIndex = this.drewMarkers.indexOf(circle);
        const height = this.storeList._elementRef.nativeElement.offsetHeight;
        this.list.scrollTop = this.listItems.find((_, i) => i === this.selectedIndex).offsetTop - height * 2.5;
      });
      this.drewInfos.push(info);
      this.drewMarkers.push(circle);
    });
    console.log('finish makemarker');
    return new Promise(() => {
      this.drewMarkers.forEach((x) => {
        x.setMap(this.map);
      });
      console.log('really finish makemarker');
    });
  }

  setCenterCommand(curplace: any) {
    const cen = new google.maps.LatLng(curplace.lat, curplace.lng);
    this.map.setCenter(cen);
    const circle = this.drewMarkers[this.places.indexOf(curplace)];
    if (circle != null) {
      const info = this.drewInfos[this.places.indexOf(curplace)];
      console.log(info.getContent());
      info.setPosition(circle.getCenter());
      info.open(this.map);
    } else {
      console.log('not found');
    }
  }

  openKakaoWayfindCommand(curplace: any) {
    window.open(`https://map.kakao.com/link/map/${curplace.name},${curplace.lat},${curplace.lng}`);
  }

  setCenterJokeCommand() {
    this.map.setCenter(new google.maps.LatLng(37.66993116807911, 127.0831345484013));
    this.map.setZoom(19);
    this.searchCommand();
  }
}
