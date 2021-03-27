import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Route', route);
    console.log('State', state);
    return this.authService.verificaAutenticacion().pipe(
      tap((estaAutenticado) => {
        if (!estaAutenticado) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    console.log('Route', route);
    console.log('Segments', segments);
    return this.authService.verificaAutenticacion().pipe(
      tap((estaAutenticado) => {
        if (!estaAutenticado) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
