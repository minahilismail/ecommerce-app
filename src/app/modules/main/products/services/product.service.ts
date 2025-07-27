import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductModel } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'https://fakestoreapi.com';
  private authSecretKey = 'Bearer Token';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem(this.authSecretKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  getAllProducts() {
    const headers = this.getHeaders();
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`, {
      headers,
    });
  }

  getProductDetailById(id: number) {
    const headers = this.getHeaders();
    return this.http.get<ProductModel>(`${this.apiUrl}/products/` + id, { headers });
  }

  getProductByCategory(category: string) {
    const headers = this.getHeaders();
    return this.http.get<ProductModel[]>(
      `${this.apiUrl}/products/category/${category}`,
      {
        headers,
      }
    );
  }

  addProduct(product: ProductModel) {
    const headers = this.getHeaders();
    return this.http.post<ProductModel>(`${this.apiUrl}/products`, product, {
      headers,
    });
  }

  editProduct(product: ProductModel){
    const headers = this.getHeaders();
    return this.http.put<ProductModel>(
      `${this.apiUrl}/products/${product.id}`,
      product,
      { headers }
    );
  }

  deleteProduct(id: number) {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers });
  }
}
