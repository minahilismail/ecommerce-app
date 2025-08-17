import { Component, Input, OnInit } from '@angular/core';
import {
  CategoryModel,
  CategoryDisplay,
  Status,
  Statuses,
  PaginationParameters,
} from '../../../categories/model/category';
import { CategoryService } from '../../../categories/services/category.service';
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
  searchQuery: string = '';
  selectedCategory: string = '';

  //pagination properties
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPreviousPage = false;
  pageSizeOptions = [5, 10, 15, 20];

  @Input() action: DialogAction = 'Update Category';

  isLoading = false;
  showArchived = false;
  Status = Statuses;
  statuses: Status[] = [];
  currentStatusId: number = Statuses.Active; // To Track current status
  statusCounts: Map<number, number> = new Map();
  Math = Math;

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
    this.getCategoriesByStatusPaged(Statuses.Active);
    this.loadAllStatusCounts(); // Load counts for badges
    this.getStatusCount(this.currentStatusId);
  }
  getCategoriesByStatusPaged(statusId: number, page: number = 1) {
    this.currentStatusId = statusId;
    this.isLoading = true;
    this.currentPage = page;

    const params: PaginationParameters = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
    };

    this.categoryService.getCategoriesPaged(params, statusId).subscribe(
      (pagedResult) => {
        console.log('Fetched paged categories:', pagedResult);
        this.categories = pagedResult.data;
        this.currentPage = pagedResult.pageNumber;
        this.pageSize = pagedResult.pageSize;
        this.totalRecords = pagedResult.totalRecords;
        this.totalPages = pagedResult.totalPages;
        this.hasNextPage = pagedResult.hasNextPage;
        this.hasPreviousPage = pagedResult.hasPreviousPage;

        this.processCategories();
        this.buildFlatDisplayList();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching paginated categories:', error);
        this.categories = [];
        this.isLoading = false;
      }
    );
  }

  // Page size change handler
  onPageSizeChange(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1; // Reset to first page
    this.getCategoriesByStatusPaged(this.currentStatusId, 1);
  }

  // Navigation handlers
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getCategoriesByStatusPaged(this.currentStatusId, page);
    }
  }

  goToNextPage() {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPreviousPage() {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Generate page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Update other methods to use pagination
  switchToStatus(statusId: number) {
    if (this.currentStatusId !== statusId) {
      this.currentPage = 1;
      this.expandedCategoryIds.clear();
      this.getCategoriesByStatusPaged(statusId, 1);
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
    return status ? status.name : '';
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
    this.getCategoriesByStatusPaged(refreshStatusId, this.currentPage);
    this.loadAllStatusCounts();
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
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Cannot Delete!',
        text: 'This category has subcategories. Please delete all subcategories first.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        backdrop: false,
        width: '350px',
        padding: '1rem',
        animation: false,
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
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'success',
                      title: 'Category status changed to deleted successfully!',
                      showConfirmButton: false,
                      timer: 2000,
                      timerProgressBar: true,
                      backdrop: false,
                      width: '350px',
                      padding: '1rem',
                      animation: false,
                    });
                    this.onCategoryUpdated();
                  },
                  (error) => {
                    console.error('Error deleting category:', error);
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'error',
                      title: 'Error',
                      text: 'Failed to delete category. Please try again.',
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
      });
  }

  archiveCategory(categoryId: number) {
    // Check if category has children
    const hasChildren = this.categories.some(
      (cat) => cat.parentCategoryId === categoryId
    );
    if (hasChildren) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Cannot Archive!',
        text: 'This category has subcategories. Please archive all subcategories first.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        backdrop: false,
        width: '350px',
        padding: '1rem',
        animation: false,
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
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'success',
                      title: 'Category has been archived successfully!',
                      showConfirmButton: false,
                      timer: 2000,
                      timerProgressBar: true,
                      backdrop: false,
                      width: '350px',
                      padding: '1rem',
                      animation: false,
                    });
                    this.onCategoryUpdated();
                  },
                  (error) => {
                    console.error('Error archiving category:', error);
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'error',
                      title: 'Error',
                      text: 'Failed to archive category. Please try again.',
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
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Restored!',
                text: 'Category has been restored successfully!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                backdrop: false,
                width: '350px',
                padding: '1rem',
                animation: false,
              });
              this.onCategoryUpdated();
            },
            (error) => {
              console.error('Error restoring category:', error);
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Error',
                text: 'Failed to restore category. Please try again.',
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
