import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  isloading = false;

  loginUser(formValue: any) {
    this.isloading = true;
    console.log('Login attempt started');

    this.authService.login(formValue.email, formValue.password).subscribe({
      next: (response: any) => {
        console.log('response', response.token);
        this.notificationService.showSuccess({
          title: 'Login successful',
          text: 'Welcome back!',
        });
        localStorage.setItem('token', response.token);
        this.router.navigate(['/products']);
        this.isloading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.notificationService.showError({
          title: 'Login failed',
          text: 'Please check your credentials and try again.',
        });
        this.isloading = false;
      },
    });
  }

  ngOnInit(): void {}
}
