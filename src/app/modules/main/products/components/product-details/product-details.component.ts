import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DialogAction } from 'src/app/modules/layout/components/dialog/dialog.component';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  id: number = 1;
  @Input() action: DialogAction = 'Update Product';

  product!: ProductModel;
  relatedProducts: ProductModel[] = [];
  quantity: number = 1;
  isAddingToCart: boolean = false;
  error: boolean = false;

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
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
      this.notificationService.showError({
        title: 'Please log in to add products to your cart.',
      });
      return;
    }
    this.notificationService.showSuccess({
      title: 'Product added to cart!',
      text: `${this.product.title.slice(0, 30)}... added to cart!`,
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      (response: any) => {
        console.log(response);
        this.notificationService.showSuccess({
          title: 'Product has been deleted.',
        });
      },
      (error) => {
        console.error('Error deleting product:', error);
        this.notificationService.showError({
          title: 'Failed to delete product. Please try again.',
        });
      }
    );
  }

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
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
        this.notificationService.showError({
          title: 'Failed to load product details. Please try again later.',
        });
      }
    );
  }
}
