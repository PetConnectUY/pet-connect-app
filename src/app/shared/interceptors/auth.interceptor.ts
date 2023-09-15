import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
      tap(() => { }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // Llama al refreshToken y maneja la respuesta
          return this.authService.refreshToken().pipe(
            switchMap((refreshed: boolean) => {
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
              this.router.navigate(['/auth/signin']);
              return throwError('Unauthorized');
            })
          );
        }
        return throwError(err);
      })
    );
  }
  
}