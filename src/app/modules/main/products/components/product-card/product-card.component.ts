import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { CartService } from '../../../cart/services/cart.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  @Input() product: ProductModel = {} as ProductModel;

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError({
        title: 'Please log in to add products to your cart.',
      });
      return;
    }
    this.cartService.addToCart(this.product, 1);
    // Show success message
    this.notificationService.showSuccess({
      title: 'Product added to cart!',
      text: `${this.product.title.slice(0, 30)}... added to cart!`,
    });
  }
  ngOnInit(): void {}
}
