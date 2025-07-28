import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayCartItemsComponent } from './components/display-cart-items/display-cart-items.component';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'cart',
    component: DisplayCartItemsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [DisplayCartItemsComponent, CartComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  exports: [CartComponent],
})
export class CartModule {}
