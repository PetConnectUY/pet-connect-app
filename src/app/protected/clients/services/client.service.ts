import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/shared/services/helper.service';
import { environment } from 'src/environments/environment.development';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) {}

  getClients(): Observable<Client[]> {
    const url = `${this.baseUrl}clients`;
    return this.http.get<Client[]>(url);
  }
}