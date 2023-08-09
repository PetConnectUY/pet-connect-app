import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient,
  ) { }

  get(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}products`);
  }

  createPaymentPreference(product: Product): Observable<any> {
    return this.http.post<Product>(`${this.baseUrl}store/${product.id}`, {});
  }
}
