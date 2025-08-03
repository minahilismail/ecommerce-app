import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryModel } from '../../model/category';
import { CategoryService } from '../../services/category.service';

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

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}

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
    if (this.action === 'Edit Category' && this.category?.parentCategoryName) {
      return this.category.parentCategoryName;
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
      console.log(
        'Adding subcategory with parent ID:',
        categoryData.parentCategoryId
      );
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
        alert('Category added successfully!');
      },
      (error) => {
        console.error('Error adding category:', error);
        alert('Failed to add category. Please try again later.');
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
        alert('Category updated successfully!');
      },
      (error) => {
        console.error('Error editing category:', error);
        alert('Failed to edit category. Please try again later.');
        this.isLoading = false;
      }
    );
  }
}
