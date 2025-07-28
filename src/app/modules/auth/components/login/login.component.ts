import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RbacService } from '../../../shared/services/rbac.service';
import { Roles } from '../../../main/user/model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private rbacService: RbacService
  ) {}

  isloading = false;

  loginUser(formValue: any) {
    this.isloading = true;
    console.log('🔵 Login attempt started');

    if (this.authService.login(formValue.email, formValue.password)) {
      console.log('🟢 Login successful');

      // Test RBAC permissions like in your test app
      console.log('Testing RBAC permissions:');
      if (this.rbacService.isGranted(Roles.ADMINISTRATOR)) {
        console.log('🟢 Access granted for administrator!');
      } else {
        console.log('🔴 Access denied for administrator!');
      }

      if (this.rbacService.isGranted(Roles.SELLER)) {
        console.log('🟢 Access granted for seller!');
      } else {
        console.log('🔴 Access denied for seller!');
      }

      if (this.rbacService.isGranted(Roles.USER)) {
        console.log('🟢 Access granted for user!');
      } else {
        console.log('🔴 Access denied for user!');
      }

      console.log('Current user:', this.authService.getCurrentUser());

      // Navigate based on role
      if (this.rbacService.isGranted(Roles.ADMINISTRATOR)) {
        console.log('🟢 Navigating admin to /admin');
        this.router.navigate(['/admin']);
      } else {
        console.log('🟢 Navigating regular user to /products');
        this.router.navigate(['/products']);
      }
    } else {
      console.error('🔴 Login failed');
      alert('Login failed. Please check your credentials and try again.');
    }
    this.isloading = false;
  }

  ngOnInit(): void {}
}
