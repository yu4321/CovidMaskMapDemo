/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterContentInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
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
  @ViewChild('storeList', {static: true}) storeList: MatList;
  curCoorText: string;
  map: google.maps.Map;
  places: any;
  latitude: any;
  longitude: any;
  selectedIndex : number;
  drewMarkers : Array<google.maps.Circle>;
  drewCircle: google.maps.Circle;
  drewInfos: Array<google.maps.InfoWindow>;
  zoom: any;

  searchZoom: 1000;
  @ViewChildren(AppOffsetTopDirective) listItems: QueryList<AppOffsetTopDirective>;
  @ViewChild(AppScrollableDirective) list: AppScrollableDirective;

  constructor(private apiService: ApiServiceService) { }

  ngOnInit() {
    this.curCoorText = '';
    this.searchZoom = 1000;
    // alert('map inited');
  }
  ngAfterContentInit() {
    const mapProp = {
      center: new google.maps.LatLng(37.5793, 127.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };
    this.drewMarkers=new Array<google.maps.Circle>();
    this.drewInfos=new Array<google.maps.InfoWindow>();
    navigator.geolocation.getCurrentPosition((x)=>{
      this.map.setCenter(new google.maps.LatLng(x.coords.latitude, x.coords.longitude));
    });
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.addListener('center_changed', ( ) => this.recenter());
    this.recenter();
    // alert('map init after');
  }
  ngAfterViewInit(): void {
    console.log('afterviewinit');
    // this.list.scrollTop = this.listItems.find((_, i) => i === this.selectedIndex).offsetTop;
    // throw new Error("Method not implemented.");
  }
  
  sliderChanged(x:any){
    this.showSearchable();
  }

  recenter() {
    const curCenter = this.map.getCenter();
    this.latitude = curCenter.lat();
    this.longitude = curCenter.lng();
    this.zoom = this.map.getZoom();
    this.setXY();
    this.showSearchable();
  }

  showSearchable(){
    if(this.drewCircle!=null){
      this.drewCircle.setMap(null);
    }
    let color='#FFFFFF';
    let circle = new google.maps.Circle({
      center:new google.maps.LatLng(this.latitude, this.longitude),
      radius:this.searchZoom,
      editable:false,
      strokeColor:color,
      fillColor:color,
      fillOpacity:0.01,
      clickable:true
    });
    circle.setMap(this.map);
    this.drewCircle=circle;
  }

  setXY() {
    this.curCoorText = '위도 : ' + this.latitude + ', 경도 : ' + this.longitude + ', 확대율: '+ this.zoom;
  }

  searchCommand() {
    const apiAddress =  new URL('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json');
    console.log('sending url: '+`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${this.latitude}&lng=${this.longitude}&m=${this.searchZoom}`);
    fetch(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${this.latitude}&lng=${this.longitude}&m=${this.searchZoom}`).then((x)=>{
      return x.json();
    }).then((res)=>{
      if(res.count>0){
        this.places=res.stores;
      }
      else
      {
        alert('결과 없음');
        this.places= null;
        this.apiService.StoreList=null;
      }
      this.apiService.StoreList=this.places;
      this.MakeMarkers();
    });
  }

  MakeMarkers(){
    this.drewMarkers.forEach((x)=>x.setMap(null));
    this.drewInfos.forEach((x)=>x.close());
    this.drewMarkers= [];
    this.drewInfos=[];
    this.places.forEach(element => {
      let color = this.GetColor(element.remain_stat);
      let circle = new google.maps.Circle({
        center:new google.maps.LatLng(element.lat, element.lng),
        radius:15,
        editable:false,
        strokeColor:color,
        fillColor:color,
        fillOpacity:0.3,
      });
      circle.setMap(this.map);
      const info = new google.maps.InfoWindow({
        content: '<div><h2>' + element.name + '</h2><p>' + element.addr + '</p></div>'
      });
      // info.setPosition(circle.getCenter());
      // info.open(this.map);
      circle.addListener('click',()=>{
        console.log(info.getContent());
        info.setPosition(circle.getCenter());
        info.open(this.map);
        this.selectedIndex=this.drewMarkers.indexOf(circle);
        console.log('selected index: '+this.selectedIndex);
        console.log('listitem cur: '+this.listItems.length);
        this.list.scrollTop = this.listItems.find((_, i) => i === this.selectedIndex).offsetTop - 200;
        // this.storeList.nativeElement[this.selectedIndex].scrollIntoView();
        // this.storeList[this.selectedIndex].scrollIntoView();
        // console.log('storelist length'+this.storeList._getListType().length);
        // console.log('storelist length'+this.storeList[0]);
        // this.sto
        // info.open(this.map);
      });
      this.drewInfos.push(info);
      this.drewMarkers.push(circle);
    });
  }

  GetColor(stat: string){
    if(stat==='empty'){
      return '#000000';
    }
    if(stat==='few'){
      return '#FF0000';
    }
    if(stat==='some'){
      return '#FFFF00';
    }
    if(stat==='plenty'){
      return '#00FF00';
    }
    else {
      return '#FFFFFF';
    }
  }

  setCenterCommand(curplace: any){
    const cen=new google.maps.LatLng(curplace.lat, curplace.lng);
    this.map.setCenter(cen);
    // this.drewMarkers.indexOf
    const circle=this.drewMarkers[this.places.indexOf(curplace)];
    if(circle!=null) {
      let info=this.drewInfos[this.places.indexOf(curplace)];
      console.log(info.getContent());
      info.setPosition(circle.getCenter());
      info.open(this.map);
    }
    else{
      console.log('not found');
    }
  }

  openKakaoWayfindCommand(curplace: any){
    let url=`https://map.kakao.com/link/map/${curplace.name},${curplace.lat},${curplace.lng}`;
    window.open(url);
  }

  setCenterJokeCommand(){
    this.map.setCenter(new google.maps.LatLng(37.66993116807911, 127.0831345484013));
    this.map.setZoom(19);
    this.searchCommand();
  }
}
