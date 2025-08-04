import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { ProductModel } from '../../model/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() action: string = '';
  @Input() product: ProductModel | null = null;

  isLoading = false;
  constructor(private productService: ProductService) {}

  // Submit method to handle both add and edit
  onSubmit(formValue: any) {
    if (this.action === 'Edit Product' && this.product) {
      this.editProduct({ ...formValue, id: this.product.id });
    } else {
      this.addProduct(formValue);
    }
  }

  addProduct(formValue: any) {
    console.log('Product added with:', formValue);
    this.isLoading = true;
    this.productService.addProduct(formValue).subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        this.isLoading = false;
        this.activeModal.close('added');
      },
      (error) => {
        console.error('Error adding product:', error);
        Swal.fire(
          'Error',
          'Failed to add product. Please try again later.',
          'error'
        );
        this.isLoading = false;
      }
    );
  }

  editProduct(formValue: any) {
    console.log('Product edited with:', formValue);
    this.isLoading = true;
    this.productService.editProduct(formValue).subscribe(
      (response) => {
        console.log('Product edited successfully:', response);
        this.isLoading = false;
        this.activeModal.close('updated');
      },
      (error) => {
        console.error('Error editing product:', error);
        Swal.fire('Error', 'Failed to edit product, Please try again later.');
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {}
}
