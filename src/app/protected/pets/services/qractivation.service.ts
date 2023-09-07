import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.development';
import { Pet } from '../../dashboard/my-pets/interfaces/pet.interface';
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

  checkIfIsActived(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}qr-codes/verify-activation/${token}`);
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
