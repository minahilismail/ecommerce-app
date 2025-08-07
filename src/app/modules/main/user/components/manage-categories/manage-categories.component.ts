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
import { ProductService } from '../../../products/services/product.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css'],
})
export class ManageCategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  flatDisplayList: CategoryDisplay[] = [];
  expandedCategoryIds: Set<number> = new Set();
  @Input() action: DialogAction = 'Update Category';
  roles = Roles;
  isLoading = false;
  showArchived = false;
  Status = Statuses;
  statuses: Status[] = [];
  currentStatusId: number = Statuses.Active; // To Track current status
  statusCounts: Map<number, number> = new Map();

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.getAllStatuses();
    this.getCategoriesByStatus(Statuses.Active);
    this.loadAllStatusCounts(); // Load counts for badges
    this.getStatusCount(this.currentStatusId);
  }

  // Switch between status tabs with animation
  switchToStatus(statusId: number) {
    if (this.currentStatusId !== statusId) {
      this.currentStatusId = statusId;
      this.expandedCategoryIds.clear(); // Clear expanded state when switching
      this.getCategoriesByStatus(statusId);
    }
  }

  // Get status-specific icons
  getStatusIcon(statusId: number): string {
    switch (statusId) {
      case Statuses.Active:
        return 'bi-check-circle-fill text-success';
      case Statuses.Archived:
        return 'bi-archive-fill text-warning';
      case Statuses.Deleted:
        return 'bi-trash-fill text-danger';
      default:
        return 'bi-circle-fill text-secondary';
    }
  }

  // Get badge classes for status counts
  getStatusBadgeClass(statusId: number): string {
    switch (statusId) {
      case Statuses.Active:
        return 'bg-success';
      case Statuses.Archived:
        return 'bg-warning';
      case Statuses.Deleted:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Get current status name
  getCurrentStatusName(): string {
    const status = this.statuses.find((s) => s.id === this.currentStatusId);
    return status ? status.name : 'Unknown';
  }

  // Get count for specific status
  getStatusCount(statusId: number): number {
    return this.statusCounts.get(statusId) || 0;
  }

  // Load counts for all statuses (for badges)
  loadAllStatusCounts() {
    this.statuses.forEach((status) => {
      this.categoryService.getCategoriesByStatus(status.id).subscribe(
        (categories) => {
          this.statusCounts.set(status.id, categories.length);
        },
        (error) => {
          console.error(`Error loading count for status ${status.id}:`, error);
          this.statusCounts.set(status.id, 0);
        }
      );
    });
  }
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
        } else {
          category.level = 0;
          category.parentCategoryId = null;
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
        console.log(categories);
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

  onCategoryUpdated(statusId?: number) {
    const refreshStatusId = statusId || this.currentStatusId;
    this.getCategoriesByStatus(refreshStatusId);
    this.loadAllStatusCounts(); // Refresh all counts
  }

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
    this.productService
      .getProductByCategory(categoryId)
      .subscribe((products) => {
        if (products.length > 0) {
          Swal.fire({
            title: 'Cannot Delete!',
            html:
              `This category contains the following <b>${products.length}</b> products:<br>` +
              `<b>` +
              products.map((p) => p.title).join('<br>') +
              `</b><br>Please delete all products first.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Delete Category?',
            text: 'This category will be moved to deleted status.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
          }).then((result) => {
            if (result.isConfirmed) {
              this.categoryService
                .updateCategoryStatus(categoryId, Statuses.Deleted)
                .subscribe(
                  () => {
                    Swal.fire(
                      'Deleted!',
                      'Category status changed to deleted successfully!',
                      'success'
                    );
                    this.onCategoryUpdated();
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
      });
  }

  archiveCategory(categoryId: number) {
    // Check if category has children
    const hasChildren = this.categories.some(
      (cat) => cat.parentCategoryId === categoryId
    );
    if (hasChildren) {
      Swal.fire({
        title: 'Cannot Archive!',
        text: 'This category has subcategories. Please archive all subcategories first.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.productService
      .getProductByCategory(categoryId)
      .subscribe((products) => {
        if (products.length > 0) {
          Swal.fire({
            title: 'Cannot Archive!',
            html:
              `This category contains the following <b>${products.length}</b> products:<br>` +
              `<b>` +
              products.map((p) => p.title).join('<br>') +
              `</b><br>Please delete all products first.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Archive Category?',
            text: 'This category will be moved to archived status.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ffc107',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Archive',
          }).then((result) => {
            if (result.isConfirmed) {
              this.categoryService
                .updateCategoryStatus(categoryId, Statuses.Archived)
                .subscribe(
                  (response) => {
                    Swal.fire(
                      'Archived!',
                      'Category has been archived successfully!',
                      'success'
                    );
                    this.onCategoryUpdated();
                  },
                  (error) => {
                    console.error('Error archiving category:', error);
                    Swal.fire(
                      'Error',
                      'Failed to archive category. Please try again.',
                      'error'
                    );
                  }
                );
            }
          });
        }
      });
  }

  restoreCategory(categoryId: number) {
    Swal.fire({
      title: 'Restore Category?',
      text: 'This category will be moved to active status.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Restore',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService
          .updateCategoryStatus(categoryId, Statuses.Active)
          .subscribe(
            (response) => {
              Swal.fire(
                'Restored!',
                'Category has been restored successfully!',
                'success'
              );
              this.onCategoryUpdated();
            },
            (error) => {
              console.error('Error restoring category:', error);
              Swal.fire(
                'Error',
                'Failed to restore category. Please try again.',
                'error'
              );
            }
          );
      }
    });
  }
}
