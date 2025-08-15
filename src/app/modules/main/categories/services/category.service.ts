import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CategoryModel,
  PagedResult,
  PaginationParameters,
  Status,
} from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  apiUrl = 'https://localhost:7177/api/categories';

  getProductCategories() {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}`);
  }

  getCategoryById(categoryId: number) {
    return this.http.get<CategoryModel>(
      `${this.apiUrl}/Category/${categoryId}`
    );
  }

  addCategory(category: CategoryModel) {
    return this.http.post<CategoryModel>(`${this.apiUrl}`, category);
  }

  editCategory(category: CategoryModel) {
    return this.http.put<CategoryModel>(
      `${this.apiUrl}/${category.id}`,
      category
    );
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }

  getCategoriesByStatus(statusId: number) {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/status/${statusId}`);
  }

  getAllStatuses() {
    return this.http.get<Status[]>(`${this.apiUrl}/statuses`);
  }

  updateCategoryStatus(id: number, statusId: number) {
    return this.http.put(`${this.apiUrl}/${id}/status?statusId=${statusId}`, {
      id,
      statusId,
    });
  }

  getCategoriesPaged(params: PaginationParameters, statusId?: number) {
    let url = `${this.apiUrl}/paged?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`;

    if (statusId) {
      // You'll need to modify the backend endpoint to accept statusId as query parameter
      url += `&statusId=${statusId}`;
    }

    return this.http.get<PagedResult<CategoryModel>>(url);
  }
}
