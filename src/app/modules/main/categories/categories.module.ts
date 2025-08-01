import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenInterceptor } from 'src/app/services/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoryFormComponent],
  imports: [CommonModule, FormsModule],
})
export class CategoriesModule {}
