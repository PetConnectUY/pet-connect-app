import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Pet } from '../interfaces/pet.interface';
import { PetImage } from '../interfaces/pet.image.interface';
import { PetPagination } from '../interfaces/pet.pagination.interface';
import { PetToken } from '../interfaces/pet.token.interface';
import { Message } from 'src/app/user/interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private baseUrl: string = environment.apiUrl;
  private cachedPets: PetPagination | null = null;
  private cacheExpirationTime: number = 60 * 1000;
  private lastCacheUpdate: number = 0;
  constructor(
    private http: HttpClient,
  ) { }

  getPets(): Observable<PetPagination> {
    const currentTime = Date.now();

    if (this.cachedPets && currentTime - this.lastCacheUpdate < this.cacheExpirationTime) {
      return of(this.cachedPets);
    } else {
      const url = `${this.baseUrl}dashboard/my-pets`;
      return this.http.get<PetPagination>(url).pipe(
        tap((pets: PetPagination) => {
          this.cachedPets = pets;
          this.lastCacheUpdate = currentTime;
        })
      );
    }
  }

  getPet(id: number): Observable<Pet> {
    const url = `${this.baseUrl}pets/${id}`;
    return this.http.get<Pet>(url);
  }

  createPet(formData: FormData): Observable<Pet> {
    const url = `${this.baseUrl}pets`;
    return this.http.post<Pet>(url, formData);
  }

  createImage(formData: FormData): Observable<PetImage> {
    const url = `${this.baseUrl}pets-images`;
    return this.http.post<PetImage>(url, formData);
  }

  updatePet(formData: FormData, id: number): Observable<Pet> {
    const url = `${this.baseUrl}pets/${id}`;
    return this.http.post<Pet>(url, formData);
  }

  updateImage(formData: FormData, id: number): Observable<PetImage> {
    const url = `${this.baseUrl}pets-images/${id}`;
    return this.http.post<PetImage>(url, formData);
  }

  deletePet(id: number): Observable<Pet> {
    const url = `${this.baseUrl}pets/${id}`;
    return this.http.delete<Pet>(url);
  }

  deletePetImage(id: number): Observable<PetImage> {
    const url = `${this.baseUrl}pets-images/${id}`;
    return this.http.delete<PetImage>(url);
  }

  deleteQrToken(id: number): Observable<PetToken> {
    const url = `${this.baseUrl}users-pets-tokens/${id}`;
    return this.http.delete<PetToken>(url);
  }

  loadProfile(token: string | null): Observable<Pet> {
    const url = `${this.baseUrl}pet-profiles/${token}`;
    return this.http.get<Pet>(url);
  }

  petFound(token: string, formData: FormData): Observable<Message> {
    const url = `${this.baseUrl}pet-profiles/${token}/pet-found`;
    return this.http.post<Message>(url, formData);
  }
}
