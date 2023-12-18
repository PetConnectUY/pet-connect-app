import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, of, tap, Observable, BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.apiUrl;
  private tokenKey: string = 'token';
  private userKey: string = 'user';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());
  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  }

  login(email: string, password: string) {
    const url = `${this.baseUrl}auth/login`;
    const body = { email, password };
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(res => {
          this.setToken(res.access_token);
          this.setUser(res.user);
        }),
        map(valid => valid),
        catchError(err => {
          return of(err);
        })
      );
  }

  authWithGoogle(user: SocialUser) {
    const url = `${this.baseUrl}auth/google`;
    return this.http.post<AuthResponse>(url, user)
      .pipe(
        tap(res => {
          this.setToken(res.access_token);
          this.setUser(res.user);
        }),
        map(valid => valid),
        catchError(err => {
          return of(err);
        })
      );
  }

  setToken(token: string) {
    sessionStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }

  getToken() {
    return sessionStorage.getItem(this.tokenKey);
  }

  getTokenValue(): string | null {
    return this.tokenSubject.value;
  }

  removeToken() {
    sessionStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null); // Emitir null a los suscriptores
  }

  setUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  } 

  getUser(): User | null {
    const jsonUser = localStorage.getItem(this.userKey);
    if (jsonUser) {
      return JSON.parse(jsonUser);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  tokenExpired() {
    const token = this.getToken();

    if (!token) {
      return true;
    }

    const payLoad = token.split('.')[1];
    const parsedPayLoad = JSON.parse(atob(payLoad));

    const expirationTime = parsedPayLoad.exp * 1000;

    return Date.now() >= expirationTime;
  }

  refreshToken(): Observable<AuthResponse> {
    const url = `${this.baseUrl}auth/refresh`;
    return this.http.post<AuthResponse>(url, {}).pipe(
      tap((res: AuthResponse) => {
        this.setToken(res.access_token);
        this.setUser(res.user);
        this.tokenSubject.next(res.access_token);
      }),
      map((valid) => valid),
      catchError((error) => of(error))
    );
  }

  getTokenHeaders() {
    return { Authorization: `Bearer ${this.getToken() || ''}` };
  }

  clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  logout() {
    this.removeToken();
  }
}
