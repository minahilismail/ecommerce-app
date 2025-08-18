import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  isloading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  signupUser(formValue: any) {
    this.isloading = true;
    this.authService.register(formValue).subscribe({
      next: (response) => {
        console.log('User signed up successfully:', response);
        this.isloading = false;
        this.notificationService.showSuccess({
          title: 'Registration successful',
          text: 'Account created successfully!',
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
