import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {User} from "./user";

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
    /* Sauvegarde les données de l'utilisateur dans le stockage local lorsque
    connecté et les définit sur null lors de la déconnexion */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  // Connexion avec email/mot de passe
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Inscription avec email/mot de passe
  SignUp(email: string, password: string, sex: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(result.user, sex);
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

  // Renvoie true lorsque l'utilisateur est connecté et que son email est vérifié
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false;
  }


  /* Configuration des données de l'utilisateur lors de la connexion avec nom d'utilisateur/mot de passe,
  l'inscription avec nom d'utilisateur/mot de passe et la connexion avec une authentification sociale
  en utilisant AngularFirestore + AngularFirestoreDocument */
  SetUserData(user: any, sex: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      id: user.uid,
      pseudo: user.displayName,
      image: user.photoURL,
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
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
