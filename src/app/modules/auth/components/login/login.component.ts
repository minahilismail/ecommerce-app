import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isloading = false;

  loginUser(formValue: any) {
    this.isloading = true;
    console.log('Login attempt started');

    this.authService.login(formValue.email, formValue.password).subscribe({
      next: (response: any) => {
        console.log('response', response.token);
        Swal.fire('Login successful', 'Welcome back!', 'success');
        localStorage.setItem('token', response.token);
        this.router.navigate(['/products']);
        this.isloading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        Swal.fire(
          'Login failed',
          'Please check your credentials and try again.',
          'error'
        );
        this.isloading = false;
      },
    });
  }

  ngOnInit(): void {}
}
