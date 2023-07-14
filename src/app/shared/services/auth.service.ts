import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {User} from "../models/user";
import {LoginRequest} from "../models/authentication/login-request";
import {from} from "rxjs";
import {SignUpRequest} from "../models/authentication/sign-up-request";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Sauvegarde les données de l'utilisateur connecté

  constructor(
    public afs: AngularFirestore, // Injecte le service Firestore
    public afAuth: AngularFireAuth, // Injecte le service d'authentification Firebase
    public router: Router,
    public ngZone: NgZone // Service NgZone pour supprimer l'avertissement hors de la portée externe
  ) {

  }

  private tokenKey = 'user'

  get loggedIn(): boolean {
    return this.token != null
  }
  get token(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  set token(value: string | null) {
    if (value) {
      localStorage.setItem(this.tokenKey, value)
    } else {
      localStorage.removeItem(this.tokenKey)
    }
  }

  // Connexion avec email/mot de passe
  SignIn(loginRequest: LoginRequest) {
    return from(this.afAuth
      .signInWithEmailAndPassword(loginRequest.email, loginRequest.password))
  }

  // Inscription avec email/mot de passe
  SignUp(signUpRequest: SignUpRequest): Promise<any>{
    return this.afAuth
      .createUserWithEmailAndPassword(signUpRequest.email, signUpRequest.password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(result.user, signUpRequest.sex, signUpRequest.pseudo);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Envoie un email de vérification lorsqu'un nouvel utilisateur s'inscrit
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Réinitialisation du mot de passe oublié
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Un email de réinitialisation du mot de passe a été envoyé. Vérifiez votre boîte de réception.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }



  SetUserData(user: any, sex: string, pseudo: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      id: user.uid,
      pseudo: pseudo,
      image: sex == 'Homme'
        ? "https://cdn-icons-png.flaticon.com/512/4139/4139981.png"
        : "https://cdn-icons-png.flaticon.com/512/219/219969.png",
      email: user.email,
      friends: [],
      awaitFriends: [],
      pendingFriendRequests: [],
      fav: [],
      sex: sex,
      objectif: 0,
      createdAt: Date.now(),
      totalDist: 0,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Déconnexion
  SignOut() {
    return this.afAuth.signOut()
  }

  updateEmail(email:string){
    return this.afAuth.currentUser.then(user => user?.updateEmail(email))
  }
}
