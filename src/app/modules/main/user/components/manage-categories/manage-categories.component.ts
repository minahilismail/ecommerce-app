import { Component, Input, OnInit } from '@angular/core';
import {
  CategoryModel,
  CategoryDisplay,
} from '../../../categories/model/category';
import { CategoryService } from '../../../categories/services/category.service';
import { Roles } from '../../model/user';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css'],
})
export class ManageCategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  displayCategories: CategoryDisplay[] = [];
  @Input() action: string = 'Edit Category';
  roles = Roles;
  isLoading = false;
  @Input() parentCategory: CategoryModel | null = null;

  constructor(private categoryService: CategoryService) {}

  getCategories() {
    this.isLoading = true;
    this.categoryService.getProductCategories().subscribe(
      (categories) => {
        this.categories = categories;
        this.buildDisplayCategories();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false;
      }
    );
  }

  buildDisplayCategories() {
    this.displayCategories = [];
    // Get only parent categories (those without parentCategoryId)
    const parentCategories = this.categories.filter(
      (cat) => !cat.parentCategoryId
    );

    parentCategories.forEach((parent) => {
      // Add parent category
      const parentDisplay: CategoryDisplay = {
        ...parent,
        isExpanded: false,
        level: 0,
      };
      this.displayCategories.push(parentDisplay);
    });
  }

  toggleCategory(category: CategoryDisplay) {
    if (this.hasSubCategories(category)) {
      category.isExpanded = !category.isExpanded;
      this.refreshDisplayList();
    }
  }

  refreshDisplayList() {
    const newDisplayList: CategoryDisplay[] = [];

    const parentCategories = this.categories.filter(
      (cat) => !cat.parentCategoryId
    );

    parentCategories.forEach((parent) => {
      const parentDisplay = this.displayCategories.find(
        (d) => d.id === parent.id
      );
      const parentItem: CategoryDisplay = {
        ...parent,
        isExpanded: parentDisplay?.isExpanded || false,
        level: 0,
      };
      newDisplayList.push(parentItem);

      // If expanded, add subcategories
      if (
        parentItem.isExpanded &&
        parent.subCategories &&
        parent.subCategories.length > 0
      ) {
        parent.subCategories.forEach((sub) => {
          const subItem: CategoryDisplay = {
            ...sub,
            isExpanded: false,
            level: 1,
          };
          newDisplayList.push(subItem);
        });
      }
    });

    this.displayCategories = newDisplayList;
  }

  hasSubCategories(category: CategoryModel): boolean {
    return category.subCategories != null && category.subCategories.length > 0;
  }

  isParentCategory(category: CategoryModel): boolean {
    return !category.parentCategoryId;
  }

  getIndentClass(level: number): string {
    return level > 0 ? 'subcategory-indent' : '';
  }

  ngOnInit(): void {
    this.getCategories();
  }

  onCategoryUpdated() {
    this.getCategories();
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        () => {
          alert('Category deleted successfully!');
          this.getCategories(); // Refresh the entire list
        },
        (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category. Please try again.');
        }
      );
    }
  }
}
