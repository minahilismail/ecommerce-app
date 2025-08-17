import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  isloading = false;
  constructor(private authService: AuthService, private router: Router) {}
  signupUser(formValue: any) {
    this.isloading = true;
    this.authService.register(formValue).subscribe({
      next: (response) => {
        console.log('User signed up successfully:', response);
        this.isloading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Registration successful',
          text: 'Account created successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          width: '350px',
          padding: '1rem',
          animation: false,
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.isloading = false;
      },
    });
  }

  ngOnInit(): void {}
}
