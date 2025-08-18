import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';

@Component({
  selector: 'app-display-cart-items',
  templateUrl: './display-cart-items.component.html',
  styleUrls: ['./display-cart-items.component.css'],
})
export class DisplayCartItemsComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    @Inject(NotificationService)
    private notificationService: NotificationService
  ) {
    console.log('DisplayCartItemsComponent constructor called');
  }

  ngOnInit(): void {
    console.log('DisplayCartItemsComponent ngOnInit called');
    console.log('Current URL:', window.location.href);
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        this.notificationService.showSuccess({
          title: 'Cleared!',
          text: 'Your cart has been cleared.',
        });
      }
    });
  }
}
