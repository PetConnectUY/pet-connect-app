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

  checkQRStatus(token: string | null): Observable<Message> {
    return this.http.get<Message>(`${this.baseUrl}qr-codes/verify-activation/${token}`);
  }

  setUserToToken(): Observable<Message> {
    const token = this.tokenService.getToken();
    return this.http.post<Message>(`${this.baseUrl}qr-codes/activate/set-user/${token}`, []);
  }

  setPetToToken(petId: number): Observable<string> {
    const token = this.tokenService.getToken();    
    return this.http.post<string>(`${this.baseUrl}qr-codes/activate/${token}`, {pet_id: petId});
  }
}