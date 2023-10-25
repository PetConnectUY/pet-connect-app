import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private cookieName = environment.cookies.tokenCookie;
  private token!: string;

  constructor(
    private cookieService: CookieService,  
  ) {}

  setCookie(token: string | null) {
    const encryption = CryptoJS.AES.encrypt(token!, environment.keys.encryption);    
    this.cookieService.set(this.cookieName, encryption.toString());
  }

  getCookie() {
    const cookie = this.cookieService.get(this.cookieName);
    if(cookie) {
      let key = environment.keys.encryption;
      
      const decrypted = CryptoJS.AES.decrypt(cookie, key);
      return decrypted.toString(CryptoJS.enc.Utf8);    
    }
    return null;
  }

  deleteCookie() {
    this.cookieService.delete(this.cookieName);
  }
}
