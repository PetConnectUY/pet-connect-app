import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Pet } from '../interfaces/pet.interface';
import { PetImage } from '../interfaces/pet.image.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private baseUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient,
  ) { }

  createPet(formData: FormData): Observable<Pet> {
    const url = `${this.baseUrl}pets`;
    return this.http.post<Pet>(url, formData);
  }

  createImage(formData: FormData): Observable<PetImage> {
    const url = `${this.baseUrl}pets-images`;
    return this.http.post<PetImage>(url, formData);
  }
}
