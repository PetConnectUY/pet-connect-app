import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  subscribe(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff'
    });
    return this.http.post(`${this.apiUrl}subscribe`, { email }, { headers });
  }
}
