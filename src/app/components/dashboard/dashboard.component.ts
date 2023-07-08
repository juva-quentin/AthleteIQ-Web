import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ParcoursService} from "../../shared/services/parcour.service";
import {Parcour} from "../../shared/models/parcour";
import {UserService} from "../../shared/services/user.service";
import {MapInfoWindow, MapMarker} from "@angular/google-maps";
import {LocationService} from "../../shared/services/location.service";
import {filter, map, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements AfterViewInit, OnDestroy {

  unsubsribe = new Subject<void>()

  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12
  };
  zoom = 5;
  seletedType = "All";
  listParcours: Parcour[] = []

  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow> | undefined;
  constructor(public userService: UserService, private parcourService: ParcoursService, private locationService: LocationService) {}

  ngOnDestroy(): void {
    this.unsubsribe.next()
    this.unsubsribe.complete()
  }
  ngAfterViewInit(): void {
    this.setMapTocurrentLocation().then(() =>
      this.parcourService.getAllParcours().pipe(
        takeUntil(this.unsubsribe),
        map(parcours => {
            console.log(parcours)
            return parcours.filter(parcour => parcour.owner === this.userService.getCurrentUser()?.id ||
            parcour.shareTo.includes(this.userService.getCurrentUser()!.id))
          }
        )
      ).subscribe({
        next: response => {
          this.listParcours = response;
        }
      })
    );
  }

  async setMapTocurrentLocation() {
    const position: any = await this.locationService.getCurrentLocation();
    this.center = {
      lat: position.lat,
      lng: position.lng
    };
   this.zoom = 10
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
      strokeColor: parcour.type == "Public" ? '#13bb00' : parcour.type == "Protected" ? '#fff200' : '#e2180a' ,
      strokeOpacity: 2.0,
      strokeWeight: 3,
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
        window.close();
        curIdx++;
      }
    });
  }

}

