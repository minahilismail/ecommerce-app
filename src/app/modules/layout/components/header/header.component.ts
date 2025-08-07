import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  get currentUser() {
    return this.authService.GetUserDataFromToken();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isSeller(): boolean {
    return this.authService.isSeller();
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
}
