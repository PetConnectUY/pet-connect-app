import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { environment } from 'src/environments/environment.development';
import { Statistics } from '../interfaces/statistic.interface';
import { UserPetProfileSetting } from '../interfaces/user-pet-profile-setting.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const result = await this.http.get<boolean>(`${this.baseUrl}users/check-email-exists/${email}`).toPromise();
      return result ?? false;
    } catch (error) {
      return false;
    }
  }

  register(formData: FormData):Observable<User> {
    const url = `${this.baseUrl}users`;
    return this.http.post<User>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      }),
    );
  }

  update(formData: FormData, id: number): Observable<User> {
    const url = `${this.baseUrl}users/${id}`;
    return this.http.post<User>(url, formData);
  }

  updateGoogleRegistration(formData: FormData, id: number): Observable<User> {
    const url = `${this.baseUrl}users/${id}/google`;
    return this.http.post<User>(url, formData); 
  }

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.baseUrl}users/statistics`);
  }

  getSettings(): Observable<UserPetProfileSetting> {
    const url = `${this.baseUrl}dashboard/get-settings`;
    return this.http.get<UserPetProfileSetting>(url);
  }

  changeSettings(formData: FormData): Observable<UserPetProfileSetting> {
    const url = `${this.baseUrl}dashboard/change-settings`;
    return this.http.post<UserPetProfileSetting>(url, formData);
  }

  changePassword(formData: FormData): Observable<User> {    
    const url = `${this.baseUrl}dashboard/change-password`;
    return this.http.post<User>(url, formData);
  }

  validateExistentEmail(formData: FormData): Observable<Message> {
    const url = `${this.baseUrl}dashboard/validate-existent-email`;
    return this.http.post<Message>(url, formData);
  }

  validateToken(formData: FormData): Observable<Message> {
    const url = `${this.baseUrl}dashboard/confirm-change-email`;
    return this.http.post<Message>(url, formData);
  }
}
