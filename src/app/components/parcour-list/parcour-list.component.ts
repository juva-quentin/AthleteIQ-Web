import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ParcoursService} from "../../shared/services/parcour.service";
import {Parcour} from "../../shared/models/parcour";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {UsersService} from "../../shared/services/user/users.service";

@Component({
  selector: 'app-parcour-list',
  templateUrl: './parcour-list.component.html',
  styleUrls: ['./parcour-list.component.scss']
})
export class ParcourListComponent implements OnInit, OnDestroy {
  unsubsribe = new Subject<void>()
  listParcours: Parcour[] = []
  filteredParcours: Parcour[] = [];
  searchTerm: string = '';
  constructor(private parcourService: ParcoursService, private userService: UsersService) { }

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
      map(parcours => {
        console.log(parcours)
        return parcours.filter(parcour => parcour.owner === this.userService.getCurrentUser()?.id)}
      )
    ).subscribe({
      next: async response => {
        console.log(response)
        this.listParcours = response;
        this.filteredParcours = response;
      }
    })
  }

  filterParcours(): void {
    if (this.searchTerm !== '') {
      this.filteredParcours = this.listParcours.filter(parcour => parcour.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredParcours = this.listParcours;
    }
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
