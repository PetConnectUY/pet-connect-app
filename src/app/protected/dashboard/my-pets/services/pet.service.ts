import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Pet } from '../interfaces/pet.interface';
import { PetImage } from '../interfaces/pet.image.interface';
import { PetPagination } from '../interfaces/pet.pagination.interface';

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
      const url = `${this.baseUrl}pets`;
      return this.http.get<PetPagination>(url).pipe(
        tap((pets: PetPagination) => {
          this.cachedPets = pets;
          this.lastCacheUpdate = currentTime;
        })
      );
    }
  }

  createPet(formData: FormData): Observable<Pet> {
    const url = `${this.baseUrl}pets`;
    return this.http.post<Pet>(url, formData);
  }

  createImage(formData: FormData): Observable<PetImage> {
    const url = `${this.baseUrl}pets-images`;
    return this.http.post<PetImage>(url, formData);
  }
}