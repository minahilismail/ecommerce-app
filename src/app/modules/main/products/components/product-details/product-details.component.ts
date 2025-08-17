import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DialogAction } from 'src/app/modules/layout/components/dialog/dialog.component';
import Swal from 'sweetalert2';

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
      Swal.fire(
        'Unauthorized',
        'Please log in to add products to your cart.',
        'warning'
      );
      return;
    }
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Product added to cart!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      backdrop: false,
      width: '350px',
      padding: '1rem',
      animation: false,
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      (response: any) => {
        console.log(response);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Product has been deleted.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          width: '350px',
          padding: '1rem',
          animation: false,
        });
      },
      (error) => {
        console.error('Error deleting product:', error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed to delete product. Please try again.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          width: '350px',
          padding: '1rem',
          animation: false,
        });
      }
    );
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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed to load product details. Please try again later.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          width: '350px',
          padding: '1rem',
          animation: false,
        });
      }
    );
  }
}
