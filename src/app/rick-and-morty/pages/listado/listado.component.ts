import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UserLogin } from 'src/app/auth/interfaces/auth.interface';
import { Response } from '../../interfaces/rick-and-morty.interface';
import { AppService } from 'src/app/services/app.service';
import { CharactersFav, Info } from '../../interfaces/rick-and-morty.interface';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styles: [
    `
      mat-paginator {
        background-color: #7b1fa2;
      }
    `,
  ],
})
export class ListadoComponent implements OnInit {
  charactersFav: CharactersFav[] = [];
  infoPagination!: Info;
  numberPage: number = 1;
  userLogin!: UserLogin;

  /* characters: number[] = [1,2,3,4,5,6,7]; */

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private appService: AppService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.appService.getCurrentUser()?.then((user) => {
      this.appService.getPropertiesUser(user?.email!).subscribe((item) => {
        this.userLogin = item.data()!;

        this.initCharactersByPage(1);
      });
    });
  }

  initCharactersByPage(page: number) {
    this.rickAndMortyService.getCharactersByPage(page).subscribe((resp) => {
      this.characterFilterFavorites(resp);
      this.infoPagination = resp.info;
    });
  }

  characterFilterFavorites(resp: Response) {
    try {
      this.rickAndMortyService
        .getCharactersFavorites(this.userLogin.email)
        .subscribe((item) => {
          const favId: number[] = item.get('charactersId');
          this.charactersFav = [];
          resp.results.forEach((character) => {
            if (favId) {
              if (favId.includes(character.id)) {
                this.charactersFav.push({
                  character: character,
                  favorite: 'warn',
                });
              } else {
                this.charactersFav.push({
                  character: character,
                  favorite: '',
                });
              }
            } else {
              this.charactersFav.push({
                character: character,
                favorite: '',
              });
            }
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  handlePage({ pageIndex }: PageEvent) {
    this.numberPage = pageIndex + 1;

    this.initCharactersByPage(this.numberPage);
  }

  getCharactersByName(termino: string) {
    this.rickAndMortyService.getCharactersByName(termino).subscribe(
      (resp) => {
        this.characterFilterFavorites(resp);
        this.infoPagination = resp.info;
      },
      () => {
        this.openSnackBar(termino);
      }
    );
  }

  openSnackBar(termino: string) {
    this._snackBar.open(
      'No se encontro ningún personaje con el termino : ' + termino,
      '',
      {
        duration: 5000,
      }
    );
  }

  tryOnDebounce(termino: string) {
    this.getCharactersByName(termino);
  }
}
