import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  apiUrl = 'https://fakestoreapi.com';

  getProductCategories() {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }
}
