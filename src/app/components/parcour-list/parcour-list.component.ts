import {Component, OnDestroy, OnInit} from '@angular/core';
import {ParcoursService} from "../../shared/services/parcour.service";
import {Parcour} from "../../shared/models/parcour";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-parcour-list',
  templateUrl: './parcour-list.component.html',
  styleUrls: ['./parcour-list.component.scss']
})
export class ParcourListComponent implements OnInit, OnDestroy {
  unsubsribe = new Subject<void>()
  listParcours: Parcour[] = []
  constructor(private parcourService: ParcoursService, private userService: UserService) { }

  ngOnInit(): void {
    this.getAllParcour()
  }

  ngOnDestroy(): void {
    this.unsubsribe.next()
    this.unsubsribe.complete()
  }
  getAllParcour(): void{
    this.parcourService.getAllParcours().pipe(
      takeUntil(this.unsubsribe),
      map(parcours => parcours.filter(parcour => parcour.owner === this.userService.getCurrentUser()?.id))
    ).subscribe({
      next: async response => {
        this.listParcours = response;
      }
    })
  }

  confirmDelete(parcour: Parcour) {
    const result = confirm('Êtes vous sur de supprimer ce parcour ?');
    if (result) {
      this.delete(parcour);
    }
  }
  delete(parcour: Parcour) {
    this.parcourService.deleteParcour(parcour.id)
  }
}
