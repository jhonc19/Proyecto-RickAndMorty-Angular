import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRountingModule } from './auth-rounting.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

@NgModule({
  declarations: [LoginComponent, RegistroComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AuthRountingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
