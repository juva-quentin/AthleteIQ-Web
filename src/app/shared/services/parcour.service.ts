import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Parcour} from "../models/parcour";
import {from, map, Observable} from "rxjs";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class ParcoursService {
  private parcoursCollection: AngularFirestoreCollection<Parcour>;

  constructor(private firestore: AngularFirestore) {
    this.parcoursCollection = this.firestore.collection<Parcour>('parcours');
  }

  getParcoursById(id: string): Observable<Parcour | undefined> {
    return this.parcoursCollection.doc<Parcour>(id)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          const data = snapshot.payload.data();
          const id = snapshot.payload.id;
          return { id, ...data } as Parcour;
        })
      );
  }


  getAllParcours(): Observable<Parcour[]> {
    return from( this.parcoursCollection.ref
      .get()
  ).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({ id: doc.id,...doc.data() as Parcour }))
      )
    );
  }

  getParcoursByOwner(ownerId: string): Observable<Parcour[]> {
    console.log(ownerId)
    return from(
      this.parcoursCollection.ref
        .where('owner', '==', ownerId)
        .get()
    ).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Parcour }))
      )
    );
  }
  getProtectedParcoursByShareTo(userId: string): Observable<Parcour[]> {
    return from(
      this.parcoursCollection.ref
        .where('type', '==', 'protected')
        .where('owner', '==', userId)
        .get()
    ).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Parcour }))
      )
    );
  }

  createParcour(parcour: Parcour): Promise<DocumentReference> {
    return this.parcoursCollection.add(parcour);
  }


  updateParcour(id: string, parcour: Parcour): Promise<void> {
    return this.parcoursCollection.doc(id).update(parcour);
  }

  deleteParcour(id: string | undefined): Promise<void> {
    return this.parcoursCollection.doc(id).delete();
  }
}
