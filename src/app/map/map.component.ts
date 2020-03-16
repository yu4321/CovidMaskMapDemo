/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterContentInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { AppOffsetTopDirective } from '../app-offset-top.directive';
import { AppScrollableDirective } from '../app-scrollable.directive';
import { GeoJsonReq, GeoJsonModel } from '../models/geoJsonModel';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  @ViewChild('storeList', {static: true}) storeList: any;
  @ViewChildren(AppOffsetTopDirective) listItems: QueryList<AppOffsetTopDirective>;
  @ViewChild(AppScrollableDirective) list: AppScrollableDirective;
  curCoorText: string;
  map: google.maps.Map;
  places: GeoJsonModel[];
  latitude: any;
  longitude: any;
  selectedIndex: number;
  drewMarkers: Array<google.maps.Circle>;
  drewCircle: google.maps.Circle;
  drewInfos: Array<google.maps.InfoWindow>;
  zoom: any;

  searchZoom: number;

  beststore: GeoJsonModel;

  constructor(private apiService: ApiServiceService) {
    apiService.listChanged.subscribe((x) => {
      if (apiService.StoreList == null) {
        this.beststore = null;
        return;
      }
      let candidate = '';
      let canNum = -1;

      const newList = new Array<any>();
      apiService.StoreList.forEach((element) => {
        newList.push({
            name: element.name,
            remain_stat: element.remain_stat,
            distance: this.distance(apiService.lastCenter.lat(), apiService.lastCenter.lng(), element.lat, element.lng)
          });
      });
      newList.sort((a, b) => a.distance - b.distance);
      newList.forEach(element => {
        const tmpval = apiService.getValByStringbyStatus(element.remain_stat);
        if (tmpval > canNum) {
          candidate = element.name;
          canNum = tmpval;
        }
      });
      this.beststore = apiService.StoreList.find((store) => store.name === candidate);
    });
  }

  ngOnInit() {
    this.curCoorText = '';
    this.searchZoom = 1000;
  }
  ngAfterContentInit() {
    const mapProp: google.maps.MapOptions = {
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

  distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
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
      const color = '#4287f5';
      const circle = new google.maps.Circle({
        center: new google.maps.LatLng(this.latitude, this.longitude),
        radius: this.searchZoom,
        editable: false,
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.1,
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
    this.curCoorText = '위도 : ' + this.latitude + ', 경도 : ' + this.longitude;
  }

  searchCommand() {
    const req = new GeoJsonReq();
    req.lat = this.latitude;
    req.lng = this.longitude;
    req.m = this.searchZoom;
    this.apiService.searchStores(req).then((x) => {
      if (x == null) {
        alert('결과 없음');
        this.places = null;
      } else {
        this.places = x;
      }
      this.makeMarkers().then(() => {
        console.log('end markmake');
      });
    });
  }

  makeMarkers(): Promise<void> {
    this.drewMarkers.forEach((x) => x.setMap(null));
    this.drewInfos.forEach((x) => x.close());
    this.drewMarkers = [];
    this.drewInfos = [];
    if (this.places == null) {
      return new Promise(() => { });
    }
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
        this.list.scrollTop = this.listItems.find((_, i) => i === this.selectedIndex).offsetTop - height;
      });
      this.drewInfos.push(info);
      this.drewMarkers.push(circle);
    });
    return new Promise(() => {
      this.drewMarkers.forEach((x) => {
        x.setMap(this.map);
      });
    });
  }

  setCenterCommand(curplace: GeoJsonModel) {
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

  openKakaoMapCommand(curplace: GeoJsonModel) {
    window.open(`https://map.kakao.com/link/map/${curplace.name},${curplace.lat},${curplace.lng}`);
  }

  openGoogleMapCommand(curplace: GeoJsonModel) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${curplace.lat},${curplace.lng}`);
  }

  menuHideShowCommand() {
    const x = document.getElementById('rightpanel');
    if (x.style.display === 'none' || x.style.display === '') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  helpHideShowCommand() {
    const x = document.getElementById('leftpanel');
    if (x.style.display === 'none' || x.style.display === '') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }
}
