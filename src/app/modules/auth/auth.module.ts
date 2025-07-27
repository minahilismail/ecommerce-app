import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/signup',
    component: SignupComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  exports: [LoginComponent, SignupComponent],
})
export class AuthModule { }
