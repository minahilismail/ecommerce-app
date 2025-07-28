import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Roles } from '../../../user/model/user';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  id: number = 1;
  @Input() action: string = 'Edit Product';
  roles = Roles;

  product!: ProductModel;
  relatedProducts: ProductModel[] = [];
  quantity: number = 1;
  isAddingToCart: boolean = false;
  error: boolean = false;

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add products to your cart.');
      return;
    }
    alert('Product added to cart successfully!');
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((response: any) => {
      console.log(response);
      alert('Product Deleted Successfully');
    });
  }

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.id = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.productService.getProductDetailById(this.id).subscribe(
      (response: ProductModel) => {
        this.product = response;
      },
      (error) => {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details. Please try again later.');
      }
    );
  }
}
