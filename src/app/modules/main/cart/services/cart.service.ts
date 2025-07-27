import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartModel } from '../model/cart';


@Injectable({
  providedIn: 'root',
})
export class CartService {
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

  getUserCart(id: string) {
    const header = this.getHeaders();
    return this.http.get<CartModel>(`${this.apiUrl}/carts/${id}`, {
      headers: header,
    });
  }
}
