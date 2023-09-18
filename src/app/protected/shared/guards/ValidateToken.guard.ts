import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenGuard implements CanActivate {
  token!: string | null;
  constructor(
    private authService: AuthService, 
    private router: Router,
    private tokenService: TokenService,
  ) {
    this.token = this.tokenService.getToken();
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.isAuthenticated()) {
        if(this.token) {
          this.router.navigate(['/auth/signin'], {queryParams: {token: this.token}});
        } else {
          this.router.navigate(['/auth/signin']);
        }
        return false;
      }
      return true;
  }
}
