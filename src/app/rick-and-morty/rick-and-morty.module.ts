import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { MaterialModule } from '../material/material.module';
import { ListadoComponent } from './pages/listado/listado.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { RickAndMortyRoutingModule } from './rick-and-morty-routing.module';
import { PersonajeCardComponent } from './components/personaje-card/personaje-card.component';
import { BuscarInputComponent } from './components/buscar-input/buscar-input.component';
import { MayusculaPipe } from './pipes/mayuscula.pipe';
import { DialogPersonajeInfoComponent } from './components/dialog-personaje-info/dialog-personaje-info.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListadoComponent,
    FavoritosComponent,
    PersonajeCardComponent,
    BuscarInputComponent,
    MayusculaPipe,
    DialogPersonajeInfoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RickAndMortyRoutingModule,
  ],
})
export class RickAndMortyModule {}
