import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { UserLogin } from '../auth/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {}


  getCurrentUser() {
    try {
      return this.angularFireAuth.authState.pipe(first()).toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  getPropertiesUser(id: string) {
    return this.angularFirestore
      .collection<UserLogin>('users-login')
      .doc(id)
      .get();
  }
}
