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
  isLoading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}
  // Update the submit method to handle both add and edit
  onSubmit(formValue: any) {
    if (this.action == 'Add Category' || this.action == 'Add SubCategory') {
      this.addCategory(formValue);
    } else if (this.action === 'Edit Category' && this.category) {
      this.editCategory({ ...formValue, id: this.category.id });
    } else {
      this.addCategory(formValue);
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

  editCategory(formValue: any) {
    console.log('Category edited with:', formValue);
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
