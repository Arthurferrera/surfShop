import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      // caso o usuário não esteja logado, redireciona para o login
      this.authService.getAuth().onAuthStateChanged(user => {
        if (!user) { this.router.navigate(['login']); }
        resolve(user ? true : false);
      });
    });
  }

}
