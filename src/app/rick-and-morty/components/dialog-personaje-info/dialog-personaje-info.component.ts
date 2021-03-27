import { Component, Input, OnInit } from '@angular/core';
import { Character, Gender } from '../../interfaces/rick-and-morty.interface';
import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'app-dialog-personaje-info',
  templateUrl: './dialog-personaje-info.component.html',
  styleUrls: ['./dialog-personaje-info.component.css'],
})
export class DialogPersonajeInfoComponent implements OnInit {
  @Input() character!: Character;
  @Input() userEmail: string = '';

  nameEpisode: string = '';

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickAndMortyService
      .getEpisodeByPath(this.character.episode[0])
      .subscribe((episode) => {
        this.nameEpisode = episode.name;
      }, () => {
        this.nameEpisode = '';
      });
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

  getImg(): string {
    return `background-image: url(${this.character.image})`;
  }

  getGenero(): string {
    let icon: string;

    switch (this.character.gender) {
      case Gender.Female:
        icon = 'female';
        break;

      case Gender.Male:
        icon = 'male';
        break;

      default:
        icon = 'transgender';
        break;
    }

    return icon;
  }
}
