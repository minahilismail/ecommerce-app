import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { ProductModel } from '../../../products/model/product';

import { DialogAction } from 'src/app/modules/layout/components/dialog/dialog.component';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'],
})
export class ManageProductsComponent implements OnInit {
  @Input() action: DialogAction = 'Update Product';

  isLoading = false;
  product!: ProductModel;
  products: ProductModel[] = [];
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  ngOnInit(): void {
    this.fetchProducts();
  }
  fetchProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    );
  }
  onProductUpdated() {
    this.fetchProducts(); // Refresh the list
  }

  deleteProduct(productId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          () => {
            this.products = this.products.filter((p) => p.id !== productId);
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Deleted!',
              text: 'Product has been deleted.',
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
              title: 'Error!',
              text: 'Failed to delete product. Please try again.',
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
    });
  }
}
