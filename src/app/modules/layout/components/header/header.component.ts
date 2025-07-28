import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { RbacService } from 'src/app/modules/shared/services/rbac.service';
import { Roles } from 'src/app/modules/main/user/model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private rbacService: RbacService
  ) {}

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAdmin(): boolean {
    return this.rbacService.isGranted(Roles.ADMINISTRATOR);
  }

  get isSeller(): boolean {
    return this.rbacService.isGranted(Roles.SELLER);
  }

  get isUser(): boolean {
    return this.rbacService.isGranted(Roles.USER);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
}
