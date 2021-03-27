import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const THUMBUP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  hide: boolean = true;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    public _snackBar: MatSnackBar
  ) {
    iconRegistry.addSvgIconLiteral(
      'thumbs-up',
      sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON)
    );
  }

  ngOnInit(): void {}

  async onLogin() {
    const { email, password } = this.loginForm.value;

    if (this.loginForm.valid) {
      await this.authService
        .login(email, password)
        .then((user) => {
          if (!user) {
            alert('Usuario o contraseña incorrectas');
          } else {
            this.openSnackBar('Usuario se Logeo correctamente');
            setTimeout(() => {
              this.router.navigate(['./personajes/listado']);
            }, 1500);
          }
        })
        .catch((error) => {
          this.openSnackBar('Error Login');
          console.log(error);
        });
    }
  }

  async onRegister() {
    const { email, password, fullName } = this.registerForm.value;

    if (this.registerForm.valid) {
      try {
        const userReg = await this.authService.register(email, password, fullName);

        if (userReg) {
          this.openSnackBar('Usuario se Registro correctamente');
          await this.authService.login(email, password).then((user) => {
            if (!user) {
              alert('Usuario o contraseña incorrectas');
            } else {
              setTimeout(() => {
                this.router.navigate(['./personajes/listado']);
              }, 1500);
            }
          });
        }
      } catch (error) {
        this.openSnackBar('Error registro');
        console.log(error);
      }
    }
  }

  openSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, '', {
      duration: 3000,
    });
  }
}
