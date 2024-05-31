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
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // Intentar refrescar el token solo si el error es 401 (no autorizado)
            if (this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS) {
              this.refreshAttempts++;
              const currentUrl = this.router.url;

              if (!this.router.url.includes('/auth/signin') && !this.router.url.includes('/users/signup')) {
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
                    if (refreshError.status === 401 || refreshError.status === 429) {
                      // Redirigir al login si el refresh token falla con 401 o 429
                      this.authService.logout();
                      if (!this.router.url.includes('/auth/signin')) {
                        this.router.navigate(['/auth/signin'], { queryParams: { redirect_url: currentUrl } });
                      }
                    }
                    return throwError(refreshError);
                  })
                );
              } else {
                return throwError({ error: 'Solicitud desde la página de inicio de sesión.' });
              }
            } else {
              this.authService.logout();
              if (!this.router.url.includes('/auth/signin')) {
                this.router.navigate(['/auth/signin'], { queryParams: { redirect_url: this.router.url } });
              }
              return throwError({ error: 'Múltiples intentos de refresco fallidos. Redirigiendo al inicio de sesión.' });
            }
          } else if (error.status === 429) {
            // Manejar el error 429 sin intentar refrescar el token
            console.error('Too Many Requests: ', error.message);
            return throwError(error);
          } else {
            return throwError(error);
          }
        } else {
          return throwError(error);
        }
      })
    );
  }
}