import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { PetPagination } from '../../pets/interfaces/pet.pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private baseUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient,
  ) { }

  getPetsToFeed(): Observable<PetPagination> {
    const url = `${this.baseUrl}community/pets`;
    return this.http.get<PetPagination>(url);
  }
}
