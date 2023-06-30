import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../models/user";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private firestore: AngularFirestore) {
    this.usersCollection = this.firestore.collection<User>('users');
  }

  createUser(user: User): Promise<void> {
    const id = this.firestore.createId();
    user.id = id;
    return this.usersCollection.doc(id).set(user);
  }

  updateUser(user: User): Promise<void> {
    const id = user.id;
    return this.usersCollection.doc(id).update(user);
  }

  deleteUser(id: string): Promise<void> {
    return this.usersCollection.doc(id).delete();
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.usersCollection.doc<User>(id)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          if (snapshot.payload.exists) {
            const data = snapshot.payload.data() as User;
            return { ...data };
          } else {
            return undefined;
          }
        })
      );
  }


  getAllUsers(): Observable<User[]> {
    return this.usersCollection.valueChanges({ idField: 'id' });
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  removeCurrentUser(): void {
    localStorage.removeItem('currentUser');
  }
}
