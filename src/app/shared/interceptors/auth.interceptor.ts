import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, mergeMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  qrToken: string | null;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
  ) {
    this.qrToken = this.tokenService.getToken();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if(this.qrToken) {
      if(this.router.url === `/pets/${this.qrToken}`) {
        return next.handle(request);
      } else {
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
                this.refreshTokenSubject.next(null);
    
                return this.authService.refreshToken().pipe(
                  switchMap((refreshed: AuthResponse) => {
                    this.isRefreshing = false;
                    if (refreshed) {
                      const newToken = this.authService.getToken();
                      if (newToken) {
                        request = request.clone({
                          setHeaders: {
                            'Authorization': `Bearer ${newToken}`
                          }
                        });
                        return next.handle(request).pipe(finalize(() => {
                          this.refreshTokenSubject.next(newToken);
                        }));
                      }
                    }
                    if (error.status === 401) {
                      const currentToken = this.authService.getToken();
                      if (currentToken) {
                        this.router.navigate(['/auth/signin'], {queryParams: {token: currentToken}});
                      } else {
                        this.router.navigate(['/auth/signin']);
                      }
                    }
                    return throwError(error);
                  })
                );
              } else {
                return this.refreshTokenSubject.pipe(
                  filter(token => token !== null),
                  take(1),
                  switchMap((newToken) => {
                    request = request.clone({
                      setHeaders: {
                        'Authorization': `Bearer ${newToken}`
                      }
                    });
                    return next.handle(request);
                  })
                );
              }
            }
            return throwError(error);
          })
        ); 
      }
    } else {
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
              this.refreshTokenSubject.next(null);
  
              return this.authService.refreshToken().pipe(
                switchMap((refreshed: AuthResponse) => {
                  this.isRefreshing = false;
                  if (refreshed) {
                    const newToken = this.authService.getToken();
                    if (newToken) {
                      request = request.clone({
                        setHeaders: {
                          'Authorization': `Bearer ${newToken}`
                        }
                      });
                      return next.handle(request).pipe(finalize(() => {
                        this.refreshTokenSubject.next(newToken);
                      }));
                    }
                  }
                  if (error.status === 401) {
                    const currentToken = this.authService.getToken();
                    if (currentToken) {
                      this.router.navigate(['/auth/signin'], {queryParams: {token: currentToken}});
                    } else {
                      this.router.navigate(['/auth/signin']);
                    }
                  }
                  return throwError(error);
                })
              );
            } else {
              return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap((newToken) => {
                  request = request.clone({
                    setHeaders: {
                      'Authorization': `Bearer ${newToken}`
                    }
                  });
                  return next.handle(request);
                })
              );
            }
          }
          return throwError(error);
        })
      ); 
    }
  }
}
