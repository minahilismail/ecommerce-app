import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryModel } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() action: string = '';
  @Input() category: CategoryModel | null = null;
  @Input() parentCategory: CategoryModel | null = null;
  isLoading = false;

  // Add this property to store the parent category name
  parentCategoryDisplayName: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    if (
      this.action === 'Edit Category' &&
      this.category?.parentCategoryId &&
      !this.category.parentCategoryName
    ) {
      this.fetchParentCategoryName(this.category.parentCategoryId);
    }
  }

  // Add method to fetch parent category name
  fetchParentCategoryName(parentId: number): void {
    this.categoryService.getCategoryById(parentId).subscribe(
      (parentCategory) => {
        this.parentCategoryDisplayName = parentCategory.name;
      },
      (error) => {
        console.error('Error fetching parent category:', error);
      }
    );
  }

  isSubcategory(): boolean {
    return (
      this.action === 'Add SubCategory' ||
      (this.action === 'Edit Category' && !!this.category?.parentCategoryId)
    );
  }

  getParentCategoryDisplayName(): string {
    if (this.action === 'Add SubCategory' && this.parentCategory) {
      return this.parentCategory.name;
    }
    if (this.action === 'Edit Category') {
      // First try to get from category object, then from fetched name
      return (
        this.category?.parentCategoryName ||
        this.parentCategoryDisplayName ||
        'Loading...'
      );
    }
    return '';
  }

  getParentCategoryId(): number | null {
    if (this.action === 'Add SubCategory' && this.parentCategory) {
      return this.parentCategory.id;
    }
    if (this.action === 'Edit Category' && this.category?.parentCategoryId) {
      return this.category.parentCategoryId;
    }
    return null;
  }

  getSubmitButtonText(): string {
    if (this.action === 'Edit Category') return 'Update';
    if (this.action === 'Add SubCategory') return 'Add Subcategory';
    return 'Add Category';
  }

  // Update the submit method to handle both add and edit
  onSubmit(formValue: CategoryModel) {
    // Ensure parentCategoryId is preserved for subcategories
    const categoryData = { ...formValue };

    // If editing a subcategory, preserve the parentCategoryId from the original category
    if (this.action === 'Edit Category' && this.category?.parentCategoryId) {
      categoryData.parentCategoryId = this.category.parentCategoryId;
    }

    // If adding a subcategory, get parentCategoryId from parentCategory input
    if (this.action === 'Add SubCategory' && this.parentCategory) {
      categoryData.parentCategoryId = this.parentCategory.id;
    }

    if (this.action === 'Edit Category' && this.category) {
      this.editCategory({ ...categoryData, id: this.category.id });
    } else {
      this.addCategory(categoryData);
    }
  }

  addCategory(formValue: any) {
    console.log('Category added with:', formValue);
    this.isLoading = true;
    this.categoryService.addCategory(formValue).subscribe(
      (response) => {
        console.log('Category added successfully:', response);
        this.isLoading = false;
        this.activeModal.close('added');
        Swal.fire('Success!', 'Category added successfully.', 'success');
      },
      (error) => {
        console.error('Error adding category:', error);
        Swal.fire(
          'Error!',
          'Failed to add category. Please try again later.',
          'error'
        );
        this.isLoading = false;
      }
    );
  }

  editCategory(formValue: CategoryModel) {
    console.log('Category form values:', formValue);
    this.isLoading = true;
    this.categoryService.editCategory(formValue).subscribe(
      (response) => {
        console.log('Category edited successfully:', response);
        this.isLoading = false;
        this.activeModal.close('updated');
        Swal.fire('Success!', 'Category updated successfully.', 'success');
      },
      (error) => {
        console.error('Error editing category:', error);
        Swal.fire(
          'Error!',
          'Failed to edit category. Please try again later.',
          'error'
        );
        this.isLoading = false;
      }
    );
  }
}
