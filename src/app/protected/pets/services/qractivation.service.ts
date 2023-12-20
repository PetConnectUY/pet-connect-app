import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.development';
import { Pet } from '../interfaces/pet.interface';
import { Message } from 'src/app/user/interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class QRActivationService {
  private baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  manageActivation(token: string | null, formData?: FormData | null): Observable<Pet | Message> {
    const url = `${this.baseUrl}qr-codes/manage-activation/${token}`;
    return this.http.post<Pet | Message>(url, formData, {
      withCredentials: true
    });
  }
}
