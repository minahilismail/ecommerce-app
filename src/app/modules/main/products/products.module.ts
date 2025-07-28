import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProductsComponent } from './components/display-products/display-products.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '../../layout/layout.module';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SearchPipe } from './pipes/search.pipe';
import { AuthGuard } from '../../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'products',
    component: DisplayProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [
    DisplayProductsComponent,
    ProductCardComponent,
    ProductFormComponent,
    ProductDetailsComponent,
    SearchPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    DisplayProductsComponent,
    ProductCardComponent,
    ProductFormComponent,
    ProductDetailsComponent,
    SearchPipe,
  ],
})
export class ProductsModule {}
