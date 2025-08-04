import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductModel } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'https://localhost:7073/api';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/Product`);
  }

  getProductDetailById(id: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Product/` + id);
  }

  getProductByCategory(category: string) {
    return this.http.get<ProductModel[]>(
      `${this.apiUrl}/products/category/${category}`
    );
  }

  addProduct(product: ProductModel) {
    return this.http.post<ProductModel>(`${this.apiUrl}/Product`, product);
  }

  editProduct(product: ProductModel) {
    return this.http.put<ProductModel>(
      `${this.apiUrl}/Product/${product.id}`,
      product
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/Product/${id}`);
  }
}
