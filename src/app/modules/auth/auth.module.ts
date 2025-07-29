import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmPasswordDirective } from './directives/confirm-password.directive';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, SignupComponent, ConfirmPasswordDirective],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  exports: [LoginComponent, SignupComponent],
})
export class AuthModule {}
