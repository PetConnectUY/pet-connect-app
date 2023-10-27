import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshAttempts = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 1;

  constructor(private authService: AuthService, private router: Router) {}

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
        if (error instanceof HttpErrorResponse && error.status === 401 || error.status === 429) {
          if (this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS) {
            this.refreshAttempts++;
            return this.authService.refreshToken().pipe(
              switchMap(() => {
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                  }
                });
                return next.handle(newRequest);
              }),
              catchError((refreshError) => {
                this.refreshAttempts = 0;
                this.authService.logout();
                this.router.navigate(['/auth/signin']);
                return throwError(refreshError);
              })
            );
          } else {
            this.authService.logout();
            this.router.navigate(['/auth/signin']);
            return throwError('Múltiples intentos de refresco fallidos. Redirigiendo al inicio de sesión.');
          }
        } else {
          return throwError(error);
        }
      })
    );
  }
}
