import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CookieService } from './cookie.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private cookieName = environment.cookies.tokenCookie;
  private token!: string;

  constructor(
    private cookieService: CookieService,
  ) {}

  getToken(token: string | null) {    
    return this.cookieService.getCookie(token);
  }

  setToken(token:string | null) {
    sessionStorage.setItem('token', token!);
  }
}
