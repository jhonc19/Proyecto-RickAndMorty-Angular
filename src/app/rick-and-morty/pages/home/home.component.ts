import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import User from 'firebase';
import { UserLogin } from 'src/app/auth/interfaces/auth.interface';
import { RickAndMortyService } from '../../services/rick-and-morty.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  user!: User.User;
  userLogin!: UserLogin;
  numberFavorites: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private rickAndMortyService: RickAndMortyService
  ) {
    rickAndMortyService.changeEmitted$.subscribe(() => this.changeFavorite());
  }

  async ngOnInit() {
    await this.appService.getCurrentUser()?.then((user) => {
      this.user = user!;
      this.appService.getPropertiesUser(user?.email!).subscribe((item) => {
        this.userLogin = item.data()!;

        this.changeFavorite();
      });
    });
  }

  async onLogout() {
    try {
      await this.authService.logout();

      this.router.navigate(['./auth']);
    } catch (error) {
      console.log(error);
    }
  }

  changeFavorite() {
    this.rickAndMortyService
      .getCharactersFavorites(this.userLogin.email)
      .subscribe((item) => {
        this.numberFavorites = item.get('charactersId').length;
      });
  }
}
