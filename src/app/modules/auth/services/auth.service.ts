import { Injectable } from '@angular/core';
import { RbacService } from '../../shared/services/rbac.service';
import { User, Role, Roles } from '../../main/user/model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private authSecretKey = 'Bearer Token';
  private userKey = 'currentUser';

  constructor(private rbacService: RbacService) {
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
    this.initializeRoles();
    this.loadUserFromStorage();
  }

  private initializeRoles(): void {
    // Initialize roles hierarchy
    this.rbacService.setRoles([
      {
        id: 1,
        name: 'User',
        uid: 'USER',
        extends: null,
      },
      {
        id: 2,
        name: 'Seller',
        uid: 'SELLER',
        extends: 1, // Seller extends User
      },
      {
        id: 3,
        name: 'Administrator',
        uid: 'ADMINISTRATOR',
        extends: 2, // Admin extends Seller
      },
    ]);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.userKey);
    if (userData && this.isAuthenticated) {
      const user = JSON.parse(userData);
      this.rbacService.setAuthenticatedUser(user);
    }
  }

  login(email: string, password: string): boolean {
    // Mock user data - in real app, this would come from your backend
    let userData: User;

    if (email === 'minahil@brickclay.com' && password === '123456') {
      // Admin user
      userData = {
        id: 1,
        name: 'Minahil Ismail',
        username: 'minahil_admin',
        email: email,
        password: password,
        role: {
          id: 3,
          name: 'Administrator',
          uid: 'ADMINISTRATOR',
          extends: 2,
        },
      };
    } else if (email === 'seller@brickclay.com' && password === '123456') {
      // Seller user
      userData = {
        id: 2,
        name: 'Seller User',
        username: 'seller_user',
        email: email,
        password: password,
        role: {
          id: 2,
          name: 'Seller',
          uid: 'SELLER',
          extends: 1,
        },
      };
    } else if (email === 'user@brickclay.com' && password === '123456') {
      // Regular user
      userData = {
        id: 3,
        name: 'Regular User',
        username: 'regular_user',
        email: email,
        password: password,
        role: {
          id: 1,
          name: 'User',
          uid: 'USER',
          extends: null,
        },
      };
    } else {
      return false;
    }

    // Save authentication state
    const authToken = 'generated_token';
    localStorage.setItem(this.authSecretKey, authToken);
    localStorage.setItem(this.userKey, JSON.stringify(userData));

    this.isAuthenticated = true;
    this.rbacService.setAuthenticatedUser(userData);

    return true;
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem(this.authSecretKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticated = false;
    this.rbacService.setAuthenticatedUser(null as any);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }
}
