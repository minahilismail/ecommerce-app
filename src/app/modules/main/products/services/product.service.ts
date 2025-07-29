import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductModel } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`);
  }

  getProductDetailById(id: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/products/` + id);
  }

  getProductByCategory(category: string) {
    return this.http.get<ProductModel[]>(
      `${this.apiUrl}/products/category/${category}`
    );
  }

  addProduct(product: ProductModel) {
    return this.http.post<ProductModel>(`${this.apiUrl}/products`, product);
  }

  editProduct(product: ProductModel) {
    return this.http.put<ProductModel>(
      `${this.apiUrl}/products/${product.id}`,
      product
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}
