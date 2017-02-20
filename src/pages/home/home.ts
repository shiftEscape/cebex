import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Config } from '../../config';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement;
  map: any;
  routes = Config.routes;
  paths = [];

  constructor(public navCtrl: NavController) {
    
  }

  ionViewDidLoad() {
    this.initMap();
  }

  // Generate LatLng Google format
  mapLatLng (routesArray): any {
    var routePath = []; 
    for(var i in routesArray) {
      routePath.push(new google.maps.LatLng(routesArray[i][0], routesArray[i][1]));
    } return routePath;
  }

  clearMapRoutes () {
    for(var i in this.paths) {
      this.paths[i].setOptions({ map: null });
    }
  }

  addMarker() {
  
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      position: this.map.getCenter()
    }); return marker;
  
  }

  getCoordsCenter (routeCode) {
    let listCoords = Config.routes[routeCode].coords;
    let len = listCoords.length;
    let mean = Math.round(len / 2);
    return { lat: listCoords[mean][0], lng: listCoords[mean][1] };
  }

  displayRoute (routeCode) {
      this.clearMapRoutes();
      this.paths[routeCode] = new google.maps.Polyline({
        path: this.mapLatLng(Config.routes[routeCode].coords), strokeColor: Config.routes[routeCode].strokeColor, strokeOpacity: 0.5, strokeWeight: 5
      });
      this.paths[routeCode].setOptions({ map: this.map });
      this.map.panTo(this.getCoordsCenter(routeCode));
  }

  

  initMap () {

    Geolocation.getCurrentPosition().then((position) => {

      // Create Google Map instance
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();

    }, (err) => {
      console.log(err);
    });

    // Display all available routes from config
    // for(var routeCode in Config.routes) {
    //   this.paths[routeCode] = new google.maps.Polyline({
    //     path: this.mapLatLng(Config.routes[routeCode].coords), strokeColor: Config.routes[routeCode].strokeColor, strokeOpacity: 0.5, strokeWeight: 5
    //   });
    //   this.paths[routeCode].setOptions({ map: this.map });
    // }
  }

}