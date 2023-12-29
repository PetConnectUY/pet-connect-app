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
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 429)) {
          if (this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS) {
            this.refreshAttempts++;
            const currentUrl = this.router.url;
    
            // Verificar si la solicitud no proviene de la página de inicio de sesión
            if (!this.router.url.includes('/auth/signin') || !this.router.url.includes('/users/signup')) {
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
                  if (!this.router.url.includes('/auth/signin')) {
                    this.router.navigate(['/auth/signin'], { queryParams: { redirect_url: currentUrl } });
                  }
                  return throwError(refreshError);
                })
              );
            } else {
              return throwError({error: 'Solicitud desde la página de inicio de sesión.'});
            }
          } else {
            this.authService.logout();
            // Asegurar que no redireccione si ya está en la página de inicio de sesión
            if (!this.router.url.includes('/auth/signin')) {
              this.router.navigate(['/auth/signin'], { queryParams: { redirect_url: this.router.url } });
            }
            return throwError({error: 'Múltiples intentos de refresco fallidos. Redirigiendo al inicio de sesión.'});
          }
        } else {
          // Devolver un observable de error para cualquier otro error
          return throwError(error);
        }
      })
    );
  }
}
