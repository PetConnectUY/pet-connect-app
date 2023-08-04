import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { environment } from 'src/environments/environment.development';

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
    return this.http.post<User>(url, formData);
  }
}
