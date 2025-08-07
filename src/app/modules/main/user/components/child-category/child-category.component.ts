import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryDisplay, Statuses } from '../../../categories/model/category';
import { Roles } from '../../model/user';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: '[app-child-category]',
  templateUrl: './child-category.component.html',
  styleUrls: ['./child-category.component.css'],
})
export class ChildCategoryComponent implements OnInit {
  constructor(private authService: AuthService) {}
  @Input() category!: CategoryDisplay;
  @Input() level: number = 0;
  @Input() isExpanded: boolean = false;
  @Input() hasChildren: boolean = false;
  @Input() canHaveSubcategories: boolean = true;
  @Input() currentStatusView: number = Statuses.Active;
  Statuses = Statuses;

  @Output() toggleExpand = new EventEmitter<CategoryDisplay>();
  @Output() categoryUpdated = new EventEmitter<void>();
  @Output() deleteCategory = new EventEmitter<number>();
  @Output() archiveCategory = new EventEmitter<number>();
  @Output() restoreCategory = new EventEmitter<number>();

  roles = Roles;

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onToggleExpand() {
    this.toggleExpand.emit(this.category);
  }

  onCategoryUpdated() {
    this.categoryUpdated.emit();
  }

  onDeleteCategory() {
    this.deleteCategory.emit(this.category.id);
  }

  onArchiveCategory() {
    this.archiveCategory.emit(this.category.id);
  }

  onRestoreCategory() {
    this.restoreCategory.emit(this.category.id);
  }

  getIndentationStyle() {
    return {
      'padding-left': `${this.level * 2.5}rem`,
    };
  }

  getLevelClass(): string {
    switch (this.level) {
      case 1:
        return 'level-1';
      case 2:
        return 'level-2';
      default:
        return 'level-0';
    }
  }

  getDisplayIcon(): string {
    if (!this.hasChildren) return '';
    return this.isExpanded ? 'bi-dash-square' : 'bi-plus-square';
  }

  getCategoryTypeLabel(): string {
    switch (this.level) {
      case 0:
        return 'Main Category';
      case 1:
        return 'Subcategory';
      case 2:
        return 'Sub-subcategory';
      default:
        return 'Category';
    }
  }

  getStatusBadge(): string {
    if (this.currentStatusView !== Statuses.Active) {
      return this.getCurrentStatusName();
    }
    return '';
  }

  getCurrentStatusName(): string {
    switch (this.category.statusId) {
      case Statuses.Active:
        return 'Active';
      case Statuses.Archived:
        return 'Archived';
      case Statuses.Deleted:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  }

  getStatusBadgeClass(): string {
    switch (this.category.statusId) {
      case Statuses.Active:
        return 'badge bg-success';
      case Statuses.Archived:
        return 'badge bg-warning';
      case Statuses.Deleted:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  ngOnInit(): void {}
}
