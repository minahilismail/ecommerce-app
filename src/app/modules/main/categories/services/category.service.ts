import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel, Status } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  apiUrl = 'https://localhost:7073/api';

  getProductCategories() {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/Category`);
  }

  getCategoryById(categoryId: number) {
    return this.http.get<CategoryModel>(
      `${this.apiUrl}/Category/${categoryId}`
    );
  }

  addCategory(category: CategoryModel) {
    return this.http.post<CategoryModel>(`${this.apiUrl}/Category`, category);
  }

  editCategory(category: CategoryModel) {
    return this.http.put<CategoryModel>(
      `${this.apiUrl}/Category/${category.id}`,
      category
    );
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(`${this.apiUrl}/Category/${categoryId}`);
  }

  getCategoriesByStatus(statusId: number) {
    return this.http.get<CategoryModel[]>(
      `${this.apiUrl}/Category/status/${statusId}`
    );
  }

  getAllStatuses() {
    return this.http.get<Status[]>(`${this.apiUrl}/Category/Status`);
  }
}
