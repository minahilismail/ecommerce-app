import { Component, Input, OnInit } from '@angular/core';
import {
  CategoryModel,
  CategoryDisplay,
  Status,
  Statuses,
} from '../../../categories/model/category';
import { CategoryService } from '../../../categories/services/category.service';
import { Roles } from '../../model/user';
import { DialogAction } from 'src/app/modules/layout/components/dialog/dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css'],
})
export class ManageCategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  flatDisplayList: CategoryDisplay[] = [];
  expandedCategoryIds: Set<number> = new Set();
  @Input() action: DialogAction = 'Edit Category';
  roles = Roles;
  isLoading = false;
  showArchived = false;
  Status = Statuses;
  statuses: Status[] = [];
  currentStatusId: number = Statuses.Active; // To Track current status

  constructor(private categoryService: CategoryService) {}

  getCategories() {
    this.isLoading = true;
    this.categoryService.getProductCategories().subscribe(
      (categories) => {
        this.categories = categories;
        this.processCategories();
        this.buildFlatDisplayList();
        this.isLoading = false;
        console.log('Categories fetched successfully:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false;
      }
    );
  }

  processCategories() {
    const categoryMap = new Map<number, CategoryModel>();

    // Create a map of all categories
    this.categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, subCategories: [] });
    });

    // Build the hierarchy
    this.categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;

      // Check if this category has children
      const hasChildren = this.categories.some(
        (c) => c.parentCategoryId === cat.id
      );
      category.hasChildren = hasChildren;

      // Set level based on hierarchy
      if (!cat.parentCategoryId) {
        category.level = 0;
      } else {
        const parent = categoryMap.get(cat.parentCategoryId);
        if (parent) {
          category.level = (parent.level || 0) + 1;
          if (!parent.subCategories) {
            parent.subCategories = [];
          }
          parent.subCategories.push(category);
        }
      }
    });

    this.categories = Array.from(categoryMap.values());
  }

  buildFlatDisplayList() {
    this.flatDisplayList = [];
    const rootCategories = this.categories.filter((cat) => cat.level === 0);

    rootCategories.forEach((root) => {
      this.addCategoryToFlatList(root);
    });
  }

  addCategoryToFlatList(category: CategoryModel) {
    const displayCategory: CategoryDisplay = {
      ...category,
      isExpanded: this.expandedCategoryIds.has(category.id),
    };

    this.flatDisplayList.push(displayCategory);

    // If category is expanded and has subcategories, add them recursively
    if (
      displayCategory.isExpanded &&
      category.subCategories &&
      category.subCategories.length > 0
    ) {
      category.subCategories.forEach((sub) => {
        this.addCategoryToFlatList(sub);
      });
    }
  }

  getCategoriesByStatus(statusId: number) {
    this.currentStatusId = statusId; // Track current status
    this.isLoading = true;
    this.categoryService.getCategoriesByStatus(statusId).subscribe(
      (categories) => {
        this.categories = categories;
        this.processCategories();
        this.buildFlatDisplayList();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching categories by status:', error);
        this.categories = [];
        this.isLoading = false;
      }
    );
  }

  onToggleCategory(category: CategoryDisplay) {
    if (this.hasChildrenInDatabase(category)) {
      if (this.expandedCategoryIds.has(category.id)) {
        this.expandedCategoryIds.delete(category.id);
      } else {
        this.expandedCategoryIds.add(category.id);
      }
      this.buildFlatDisplayList();
    }
  }

  hasChildrenInDatabase(category: CategoryModel): boolean {
    return (
      category.hasChildren === true ||
      this.categories.some((cat) => cat.parentCategoryId === category.id)
    );
  }

  canHaveSubcategories(category: CategoryModel): boolean {
    return (category.level || 0) < 2; // Max 3 levels (0, 1, 2)
  }

  ngOnInit(): void {
    this.getCategoriesByStatus(1);
    this.getAllStatuses();
  }

  onCategoryUpdated(statusId?: number) {
    // Use the provided statusId or default to Active status
    const currentStatusId = statusId || Statuses.Active;
    this.getCategoriesByStatus(currentStatusId);
  }

  archiveCategory(category: CategoryModel) {}

  getAllStatuses() {
    this.categoryService.getAllStatuses().subscribe(
      (statuses) => {
        console.log('Statuses fetched successfully:', statuses);
        this.statuses = statuses;
      },
      (error) => {
        console.error('Error fetching statuses:', error);
      }
    );
  }
  deleteCategory(categoryId: number) {
    // Check if category has children
    const hasChildren = this.categories.some(
      (cat) => cat.parentCategoryId === categoryId
    );

    if (hasChildren) {
      Swal.fire({
        title: 'Cannot Delete!',
        text: 'This category has subcategories. Please delete all subcategories first.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Category deleted successfully!', 'success');
            this.getCategories();
          },
          (error) => {
            console.error('Error deleting category:', error);
            Swal.fire(
              'Error',
              'Failed to delete category. Please try again.',
              'error'
            );
          }
        );
      }
    });
  }
}
