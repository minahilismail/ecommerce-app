import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { ProductModel } from '../../model/product';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../categories/services/category.service';
import { CategoryModel, Statuses } from '../../../categories/model/category';

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
  categories: CategoryModel[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  showImageUpload: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  // Handle file selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire(
          'Error',
          'Only image files (JPG, JPEG, PNG) are allowed.',
          'error'
        );
        this.removeImage();
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'File size cannot exceed 5MB.', 'error');
        return;
      }

      this.selectedImage = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    if (this.product) {
      this.product.image = '';
    }

    // Clear the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Submit method to handle both add and edit
  onSubmit(formValue: any) {
    if (this.action === 'Update Product' && this.product) {
      this.editProduct({ ...formValue, id: this.product.id });
    } else {
      this.addProduct(formValue);
    }
  }

  fetchCategories() {
    this.categoryService.getCategoriesByStatus(Statuses.Active).subscribe(
      (categories) => {
        console.log('Fetched categories:', categories);
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  addProduct(formValue: any) {
    console.log('Product added with:', formValue);
    this.isLoading = true;

    this.productService
      .addProduct(formValue, this.selectedImage || undefined)
      .subscribe(
        (response) => {
          console.log('Product added successfully:', response);
          Swal.fire('Success', 'Product added successfully!', 'success');
          this.isLoading = false;
          this.activeModal.close('added');
        },
        (error) => {
          console.error('Error adding product:', error);
          this.handleError(error);
          this.isLoading = false;
        }
      );
  }

  editProduct(formValue: any) {
    console.log('Product edited with:', formValue);
    this.isLoading = true;

    this.productService
      .editProduct(formValue, this.selectedImage || undefined)
      .subscribe(
        (response) => {
          console.log('Product edited successfully:', response);
          Swal.fire('Success', 'Product updated successfully!', 'success');
          this.isLoading = false;
          this.activeModal.close('updated');
        },
        (error) => {
          console.error('Error editing product:', error);
          this.handleError(error);
          this.isLoading = false;
        }
      );
  }

  updateImageOnly() {
    if (!this.selectedImage || !this.product) {
      return;
    }

    this.isLoading = true;
    this.productService
      .uploadProductImage(this.product.id, this.selectedImage)
      .subscribe(
        (response) => {
          console.log('Image updated successfully:', response);
          Swal.fire(
            'Success',
            'Product image updated successfully!',
            'success'
          );
          this.isLoading = false;
          this.activeModal.close('updated');
        },
        (error) => {
          console.error('Error updating image:', error);
          this.handleError(error);
          this.isLoading = false;
        }
      );
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred. Please try again.';

    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.errors) {
        // Handle validation errors
        const errors = Object.values(error.error.errors).flat();
        errorMessage = errors.join(', ');
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    }

    Swal.fire('Error', errorMessage, 'error');
  }

  ngOnInit(): void {
    this.fetchCategories();

    // Set image preview for edit mode
    if (this.product?.image && this.action === 'Update Product') {
      this.imagePreview = this.product?.image;
    }
  }

  // Helper method to check if image upload should be shown
  get shouldShowImageUpload(): boolean {
    return !this.imagePreview;
  }
}
