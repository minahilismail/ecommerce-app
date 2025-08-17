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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Login successful',
          text: 'Welcome back!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          width: '350px',
          padding: '1rem',
          animation: false,
        });
        localStorage.setItem('token', response.token);
        this.router.navigate(['/products']);
        this.isloading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Login failed',
          text: 'Please check your credentials and try again.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          width: '350px',
          padding: '1rem',
          animation: false,
        });
        this.isloading = false;
      },
    });
  }

  ngOnInit(): void {}
}
