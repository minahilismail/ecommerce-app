import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartItemsCount: number = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartItemsCount = this.cartService.getCartItemsCount();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}