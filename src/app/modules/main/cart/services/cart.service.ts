import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartModel, ProductInCart } from '../model/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel } from '../../products/model/product';

export interface CartItem {
  product: ProductModel;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem(this.authSecretKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  apiUrl = 'https://fakestoreapi.com';
  private authSecretKey = 'Bearer Token';

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  // Add product to cart
  addToCart(product: ProductModel, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCartToStorage();
  }

  // Remove product from cart
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  // Update quantity
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
      }
    }
  }

  // Get cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Get cart items count
  getCartItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total price
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
  }

  // API method for getting user cart (existing functionality)
  getUserCart(id: number): Observable<CartModel> {
    const header = this.getHeaders();
    return this.http.get<CartModel>(`${this.apiUrl}/carts/${id}`, {
      headers: header,
    });
  }
}