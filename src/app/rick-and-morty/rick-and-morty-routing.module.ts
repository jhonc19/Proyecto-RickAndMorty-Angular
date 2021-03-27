import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { HomeComponent } from './pages/home/home.component';
import { ListadoComponent } from './pages/listado/listado.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'listado',
        component: ListadoComponent,
      },
      {
        path: 'favoritos',
        component: FavoritosComponent,
      }
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RickAndMortyRoutingModule {}
