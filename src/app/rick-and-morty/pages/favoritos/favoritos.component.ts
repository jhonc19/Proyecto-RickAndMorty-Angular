import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/auth/interfaces/auth.interface';
import { AppService } from 'src/app/services/app.service';
import { CharactersFav } from '../../interfaces/rick-and-morty.interface';
import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
})
export class FavoritosComponent implements OnInit {
  charactersFav: CharactersFav[] = [];
  userLogin!: UserLogin;

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private appService: AppService
  ) {}

  async ngOnInit() {
    await this.appService.getCurrentUser()?.then((user) => {
      this.appService.getPropertiesUser(user?.email!).subscribe((item) => {
        this.userLogin = item.data()!;

        this.rickAndMortyService
          .getCharactersFavorites(this.userLogin.email)
          .subscribe((item) => {
            if (item.get('charactersId').length > 1) {
              this.rickAndMortyService
                .getCharactersByMultipleId(item.get('charactersId'))
                .subscribe((resp) => {
                  resp.forEach((character) => {
                    this.charactersFav.push({
                      character: character,
                      favorite: 'warn',
                    });
                  });
                });
            } else if (item.get('charactersId').length === 1) {
              this.rickAndMortyService
                .getCharacterById(item.get('charactersId')[0])
                .subscribe((character) => {
                  this.charactersFav.push({
                    character: character,
                    favorite: 'warn',
                  });
                });
            }
          });
      });
    });
  }

  changeFavorite(id: number) {
    let characterFavTemp: CharactersFav[] = this.charactersFav.filter(
      ({ character }) => {
        return character.id !== id;
      }
    );

    this.charactersFav = characterFavTemp;
  }
}
