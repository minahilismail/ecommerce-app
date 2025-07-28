import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { CartService } from '../../../cart/services/cart.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}
  @Input() product: ProductModel = {} as ProductModel;

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add products to your cart.');
      return;
    }
    this.cartService.addToCart(this.product, 1);
    // Show success message
    const alertDiv = document.createElement('div');
    alertDiv.className =
      'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText =
      'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
      <strong>Success!</strong> ${this.product.title.slice(
        0,
        30
      )}... added to cart!
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 3000);
  }

  ngOnInit(): void {}
}
