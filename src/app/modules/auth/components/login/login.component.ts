import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}
  isloading = false;
  loginUser(formValue: any) {
    this.isloading = true;
    if (this.authService.login(formValue.email, formValue.password)) {
      this.router.navigate(['/products']);
    } else {
      console.error('Login failed');
      alert('Login failed. Please check your credentials and try again.');
    }
    this.isloading = false;
  }


  ngOnInit(): void {
  }

}
