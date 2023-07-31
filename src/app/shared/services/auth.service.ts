import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.apiUrl;
  private tokenKey: string = 'token';
  private userKey: string = 'user';
  constructor(
    private http: HttpClient,
  ) { }

  login(username: string, password: string) {
    const url = `${this.baseUrl}auth/login`;
    const body = { username, password };
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(
          res => {
            this.setAuthData(res.access_token, res.user);
          }
        ),
        map(valid => valid),
        catchError( err => {
          return of(err);
        })
      )
  }

  setToken(token: string) {
    return sessionStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return sessionStorage.getItem(this.tokenKey);
  }

  removeToken() {
    return sessionStorage.removeItem(this.tokenKey);
  }

  setUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  } 

  getUser(): User|null {
    const jsonUser = localStorage.getItem(this.userKey);
    if(jsonUser)
    {
      return JSON.parse(jsonUser);
    }
    return null;
  }

  isAuthenticated():boolean {
    return Boolean(this.getToken());
  }

  tokenExpired() {
    const token = this.getToken();
    const payLoad = atob(token!.split('.')[1]);
    const parsedPayLoad = JSON.parse(payLoad);

    return parsedPayLoad.exp > Date.now() / 1000;
  }

  refreshToken(): Observable<boolean> {
    const url = `${this.baseUrl}auth/refresh`;
    return this.http.post<AuthResponse>(url, {})
      .pipe(
        tap( res => {
          this.setAuthData(res.access_token, res.user);
        }),
        map( valid => valid ),
          catchError(err => {
            return of(err)
          })
      );
  }

  private setAuthData(token: string, user: User) {
    this.setToken(token);
    this.setUser(user);
  }

  getTokenHeaders() {
    return {Authorizathion: `Bearer ${this.getToken() || ''}`};
  }

  clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  logout() {
    this.removeToken();
  }
}