import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(
    private http: HttpClient,
  ) { }

  getAddressSuggestions(query: string): Observable<string[]> {
    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      countrycodes: 'UY'
    };

    return this.http.get<any[]>(this.baseUrl, { params })
      .pipe(
        // Map the response to extract the display names of the suggestions
        map((data: any[]) => data.map(item => item.display_name))
      );
  }
}
