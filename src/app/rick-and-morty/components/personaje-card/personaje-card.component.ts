import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/services/app.service';
import { Character } from '../../interfaces/rick-and-morty.interface';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { DialogPersonajeInfoComponent } from '../dialog-personaje-info/dialog-personaje-info.component';

@Component({
  selector: 'app-personaje-card',
  templateUrl: './personaje-card.component.html',
  styles: [
    `
      .point-icon {
        font-size: 10px;
        height: 10px;
        width: 10px;
      }

      .color-green {
        color: rgb(85, 204, 68);
      }

      .color-red {
        color: rgb(214, 61, 46);
      }
    `,
  ],
})
export class PersonajeCardComponent implements OnInit {
  @Input() character!: Character;
  @Input() favorite: string = '';

  @Output() onChange: EventEmitter<number> = new EventEmitter();

  userEmail: string = '';

  isAdding: boolean = false;
  isDelete: boolean = false;

  constructor(
    private rickAndMortyService: RickAndMortyService,
    private appService: AppService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.appService.getCurrentUser()?.then((user) => {
      this.appService.getPropertiesUser(user?.email!).subscribe((item) => {
        this.userEmail = item.data()!.email;
      });
    });
  }

  changeFavorite() {
    if (this.favorite === '') {
      this.addCharacterFavorite();
    } else {
      this.deleteCharacterFavorite();
      this.onChange.emit(this.character.id);
    }
  }

  openDialog() {
    const refDialogComponent = this.dialog.open(DialogPersonajeInfoComponent);
    refDialogComponent.componentInstance.userEmail = this.userEmail;
    refDialogComponent.componentInstance.character = this.character;
  }

  getColorDinamic(): string {
    let classString: string;
    switch (this.character.status) {
      case 'Alive':
        classString = 'point-icon color-green';
        break;
      case 'Dead':
        classString = 'point-icon color-red';
        break;
      default:
        classString = 'point-icon';
        break;
    }

    return classString;
  }

  addCharacterFavorite() {
    if (!this.isAdding) {
      this.rickAndMortyService.addCharactersFavorites(
        this.userEmail,
        this.character.id
      );
      this.isAdding = true;
      setTimeout(() => {
        this.isAdding = false;
        this.openSnackBar('Se agregró a favoritos');
        this.favorite = 'warn';
      }, 250);
    }
  }

  deleteCharacterFavorite() {
    if (!this.isDelete) {
      this.rickAndMortyService.deleteCharactersFavorites(
        this.userEmail,
        this.character.id
      );
      this.isDelete = true;
      setTimeout(() => {
        this.isDelete = false;
        this.openSnackBar('Se quitó de favoritos');
        this.favorite = '';
      }, 250);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
    });
  }
}
