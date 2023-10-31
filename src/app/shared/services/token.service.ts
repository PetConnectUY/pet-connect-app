import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private cookieName = environment.cookies.tokenCookie;

  constructor(
    private cookieService: CookieService,  
  ) {}

  setCookie(token: string | null) {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    const encryption = CryptoJS.AES.encrypt(token!, environment.keys.encryption);   
    this.cookieService.set(this.cookieName, encryption.toString(), date, '/', undefined, true, 'Strict');
  }

  getCookie() {
    const cookie = this.cookieService.get(this.cookieName);
    if(cookie) {
      let key = environment.keys.encryption;
      
      const decrypted = CryptoJS.AES.decrypt(cookie, key);
      return decrypted.toString(CryptoJS.enc.Utf8);    
    } else {
      return null;
    }
  }

  deleteCookie() {
    this.cookieService.delete(this.cookieName);
  }
}
