import { Injectable } from '@angular/core';
import { User } from '../../main/user/model/user';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private userKey = 'currentUser';
  private apiUrl = 'https://localhost:7073/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    this.isAuthenticated = token ? !this.isTokenExpired(token) : false;

    if (this.isAuthenticated) {
      const userData = this.GetUserDataFromToken();
      if (userData) {
        this.currentUserSubject.next(userData);
      }
    }
  }
  login(email: string, password: string): Observable<string> {
    const loginRequest: any = { email, password };
    return this.http.post<string>(`${this.apiUrl}/Auth/login`, loginRequest);
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/register`, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return of(null);
      })
    );
  }

  GetUserDataFromToken(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = atob(base64Payload);
      const payload = JSON.parse(decodedPayload);
      const userRoles: string[] = [];
      if (payload.isAdmin === '1') userRoles.push('Administrator');
      if (payload.isSeller === '1') userRoles.push('Seller');
      if (payload.isUser === '1') userRoles.push('User');
      console.log('User with roles:', { ...payload, roles: userRoles });
      return { ...payload, roles: userRoles };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const userData = this.GetUserDataFromToken();
    if (!userData) {
      return false;
    }
    return userData.roles?.includes('Administrator') ?? false;
  }

  isSeller(): boolean {
    const userData = this.GetUserDataFromToken();
    if (!userData) {
      return false;
    }
    return userData.roles?.includes('Seller') ?? false;
  }

  isUser(): boolean {
    const userData = this.GetUserDataFromToken();
    if (!userData) {
      return false;
    }
    return userData.roles?.includes('User') ?? false;
  }
  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      this.logout(); // Clear expired token
      return false;
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.userKey);
    this.isAuthenticated = false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
