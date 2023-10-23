import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
  ) { }

  getCookie(token: string | null): Observable<string> {
    const url = `${this.baseUrl}qr-codes/activation-cookie/${token}`;
    return this.http.get<string>(url, {
      withCredentials: true,
    });
  }
}
