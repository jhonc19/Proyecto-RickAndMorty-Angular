import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

import { Character, Episode, Response } from '../interfaces/rick-and-morty.interface';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private baseUrl: string = 'https://rickandmortyapi.com/api';
  private emitChangeSource = new Subject<void>();

  constructor(
    private http: HttpClient,
    private angularFirestore: AngularFirestore
  ) {}

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange() {
    this.emitChangeSource.next();
  }

  getEpisodeByPath(path: string) {
    return this.http.get<Episode>(`${path}`);
  }

  getCharacter(): Observable<Response> {
    return this.http.get<Response>(`${this.baseUrl}/character`);
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  getCharactersByName(name: string): Observable<Response> {
    const params: HttpParams = new HttpParams().set('name', `${name}`);
    return this.http.get<Response>(`${this.baseUrl}/character`, { params });
  }

  getCharactersByMultipleId(arrayId: number[]): Observable<Character[]> {
    const idString: string = arrayId.join();
    return this.http.get<Character[]>(`${this.baseUrl}/character/${idString}`);
  }

  getCharactersByPage(page: number = 1): Observable<Response> {
    const params: HttpParams = new HttpParams().set('page', `${page}`);
    return this.http.get<Response>(`${this.baseUrl}/character`, { params });
  }

  getCharactersFavorites(id: string) {
    return this.angularFirestore
      .collection<number[]>('characters-favorites')
      .doc(id)
      .get();
  }

  addCharactersFavorites(id: string, characterId: number) {
    const charactersIdRef = this.angularFirestore
      .collection('characters-favorites')
      .doc(id);

    this.getCharactersFavorites(id).subscribe((item) => {
      if (item.data()) {
        charactersIdRef.update({
          charactersId: [...item.get('charactersId'), characterId],
        });
      } else {
        charactersIdRef
          .set({
            charactersId: [characterId],
          })
          .then();
      }

      this.emitChange();
    });
  }

  deleteCharactersFavorites(id: string, characterId: number) {
    const charactersIdRef = this.angularFirestore
      .collection('characters-favorites')
      .doc(id);

    this.getCharactersFavorites(id).subscribe((item) => {
      const charactersTemp: number[] = [...item.get('charactersId')].filter(
        (item) => item !== characterId
      );

      charactersIdRef.update({
        charactersId: [...charactersTemp],
      });
    });
    this.emitChange();
  }
}
