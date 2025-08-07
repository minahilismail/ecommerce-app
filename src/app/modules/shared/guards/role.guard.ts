import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    const userData = this.authService.GetUserDataFromToken();
    if (!userData) {
      return false;
    }

    const allowedRoles: string[] = ['Administrator'];

    const userRoles: string[] = [];
    if (userData.isAdmin === '1') userRoles.push('Administrator');
    if (userData.isSeller === '1') userRoles.push('Seller');
    if (userData.isUser === '1') userRoles.push('User');
    console.log('User roles:', userRoles);
    // Checking if user has at least one allowed role
    return allowedRoles.some((role) => userRoles.includes(role));
  }
}
