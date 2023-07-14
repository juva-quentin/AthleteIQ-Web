import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { filter, from, map, Observable, of, switchMap } from 'rxjs';

import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../models/user";
import {AuthService} from "../auth.service";

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userCollection: AngularFirestoreCollection<User>;
  constructor(private afs: AngularFirestore, private authService: AuthService, private fireStorage: AngularFireStorage) {
    this.userCollection = this.afs.collection('users');
  }

  getUser = (userid?: string) => this.userCollection.doc(userid).valueChanges();


  updateUserProfileImg(urlImg: string, userID?: string): Promise<void> {
    return this.userCollection.doc(userID).update({ image: urlImg });
  }

  async updateUserProfilInfo(userInfo: User, userID?: string): Promise<void> {
    await this.authService.updateEmail(userInfo.email!)
    return this.userCollection.doc(userID).update(userInfo);
  }


  createUser(user: User): Promise<void> {
    const id = this.afs.createId();
    user.id = id;
    return this.userCollection.doc(id).set(user);
  }

  updateUser(user: User): Promise<void> {
    const id = user.id;
    return this.userCollection.doc(id).update(user);
  }

  deleteUser(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }

  getUserById(id: string): Observable<User[]> {
    return this.afs.collection<User>('users', (ref)=> ref.where("id", '==', id ))
      .snapshotChanges()
      .pipe(
        map((actions)=> {
          return actions.map((item)=> {
            return {
              ...item.payload.doc.data(),
            } as User
          })
        })
      )
  }


  getAllUsers(): Observable<User[]> {
    return this.userCollection.valueChanges({ idField: 'id' });
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
