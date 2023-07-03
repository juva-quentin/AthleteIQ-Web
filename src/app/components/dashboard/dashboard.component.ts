import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {ParcoursService} from "../../shared/services/parcour.service";
import {Parcour} from "../../shared/models/parcour";
import {UserService} from "../../shared/services/user.service";
import {MapInfoWindow, MapMarker} from "@angular/google-maps";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements AfterViewInit {



  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12
  };
  zoom = 4;

  listParcours: Parcour[] = []

  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow> | undefined;
  constructor(public userService: UserService, private parcourService: ParcoursService) {}

  ngAfterViewInit(): void {
    this.parcourService.getAllParcours().subscribe({
      next: response => {
        this.listParcours = response
      }
      }
    )
  }



  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  getAllPoints(parcour : Parcour) : object {

    const coordinates: google.maps.LatLngLiteral[] = [];
    for (const polyline of parcour.allPoints) {
      coordinates.push({ lat: polyline.latitude, lng: polyline.longitude });
    }
    return {
      path : coordinates,
      strokeColor: parcour.type == "Public" ? '#13bb00' : parcour.type == "Protected" ? '#dde20a' : '#e2180a' ,
      strokeOpacity: 2.0,
      strokeWeight: 2.5,
    }
  }

  getMarker(parcour : Parcour) : google.maps.LatLng{
     return  new google.maps.LatLng(parcour.allPoints[0].latitude, parcour.allPoints[0].longitude)
  }

  openInfoWindow(marker: MapMarker, windowIndex: number) {
    /// stores the current index in forEach
    let curIdx = 0;
    this.infoWindowsView!.forEach((window: MapInfoWindow) => {
      if (windowIndex === curIdx) {
        window.open(marker);
        curIdx++;
      } else {
        curIdx++;
      }
    });
  }

}

