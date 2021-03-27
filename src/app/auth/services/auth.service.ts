import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserLogin } from '../interfaces/auth.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /*   authState: FirebaseAuthState = null; */

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {}

  async login(email: string, password: string) {
    try {
      const result = await this.angularFireAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (result) {
        localStorage.setItem('token', result.user?.uid!);
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async register(email: string, password: string, nombres: string) {
    try {
      const result = await this.angularFireAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      let user: UserLogin = {
        email: email,
        nombres: nombres,
        dateCreate: new Date(),
      };

      this.angularFirestore.collection('users-login').doc(user.email).set(user);

      return result;
    } catch (error) {
      console.log('Error de registro')
      console.log(error);
    }
  }

  async logout() {
    try {
      await this.angularFireAuth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  verificaAutenticacion(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map((res) => {
        if (res && res.uid) return true;

        return false;
      })
    );
  }
}
