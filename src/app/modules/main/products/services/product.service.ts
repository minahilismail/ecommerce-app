import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductModel } from '../model/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'https://localhost:7177/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<ProductModel[]>(`${this.apiUrl}`);
  }

  getProductDetailById(id: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`);
  }

  getProductByCategory(categoryId: number) {
    return this.http.get<ProductModel[]>(
      `${this.apiUrl}/category/${categoryId}`
    );
  }

  // Updated to handle FormData for file uploads
  addProduct(productData: any, imageFile?: File): Observable<ProductModel> {
    const formData = new FormData();

    // Append product data
    formData.append('title', productData.title);
    formData.append('price', productData.price.toString());
    formData.append('description', productData.description);
    formData.append('categoryId', productData.categoryId.toString());

    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<ProductModel>(`${this.apiUrl}`, formData);
  }

  // Updated to handle FormData for file uploads
  editProduct(productData: any, imageFile?: File): Observable<any> {
    const formData = new FormData();

    // Append product data
    formData.append('id', productData.id.toString());
    formData.append('title', productData.title);
    formData.append('price', productData.price.toString());
    formData.append('description', productData.description);
    formData.append('categoryId', productData.categoryId.toString());

    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put(`${this.apiUrl}/${productData.id}`, formData);
  }

  uploadProductImage(productId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('image', imageFile);

    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
