import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem(this.authSecretKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  apiUrl = 'https://fakestoreapi.com';
  private authSecretKey = 'Bearer Token';

  getProductCategories() {
    const headers = this.getHeaders();
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`, {
      headers,
    });
  }
}
