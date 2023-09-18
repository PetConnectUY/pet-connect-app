import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  token!: string | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
  ) {
    this.token = this.tokenService.getToken();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (currentUser && token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            return this.authService.refreshToken().pipe(
              switchMap((refreshed: boolean) => {
                this.isRefreshing = false;
                if (refreshed) {
                  const newToken = this.authService.getToken();
                  if (newToken) {
                    request = request.clone({
                      setHeaders: {
                        'Authorization': `Bearer ${newToken}`
                      }
                    });
                    return next.handle(request);
                  }
                }
                if (error.status === 401) {
                  if(this.token) {
                    this.router.navigate(['/auth/signin'], {queryParams: {token: this.token}});
                  } else {
                    this.router.navigate(['/auth/signin']);
                  }
                }
                return throwError(error);
              })
            );
          }
        }
        return throwError(error);
      })
    );
  }
}
