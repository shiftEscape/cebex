import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../config';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement;
  map: any;
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

  initMap () {

    // Create Google Map instance
    let latLng = new google.maps.LatLng(Config.focusMapCoords.lat, Config.focusMapCoords.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Display all available routes from config
    for(var routeCode in Config.routes) {
      this.paths[routeCode] = new google.maps.Polyline({
        path: this.mapLatLng(Config.routes[routeCode].coords), strokeColor: Config.routes[routeCode].strokeColor, strokeOpacity: 0.5, strokeWeight: 5
      });
      this.paths[routeCode].setOptions({ map: this.map });
    }
  }

}
