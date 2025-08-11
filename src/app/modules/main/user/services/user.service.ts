import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role, User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'https://localhost:7073/api';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/User`);
  }

  updateUser(userId: number, userData: User) {
    return this.http.put(`${this.apiUrl}/User/${userId}`, userData);
  }

  getRoles() {
    return this.http.get<Role[]>(`${this.apiUrl}/User/roles`);
  }
}
