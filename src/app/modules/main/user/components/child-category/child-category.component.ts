import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryDisplay } from '../../../categories/model/category';
import { Roles } from '../../model/user';

@Component({
  selector: '[app-child-category]',
  templateUrl: './child-category.component.html',
  styleUrls: ['./child-category.component.css'],
})
export class ChildCategoryComponent implements OnInit {
  constructor() {}
  @Input() category!: CategoryDisplay;
  @Input() level: number = 0;
  @Input() isExpanded: boolean = false;
  @Input() hasChildren: boolean = false;
  @Input() canHaveSubcategories: boolean = true;

  @Output() toggleExpand = new EventEmitter<CategoryDisplay>();
  @Output() categoryUpdated = new EventEmitter<void>();
  @Output() deleteCategory = new EventEmitter<number>();

  roles = Roles;

  onToggleExpand() {
    this.toggleExpand.emit(this.category);
  }

  onCategoryUpdated() {
    this.categoryUpdated.emit();
  }

  onDeleteCategory() {
    this.deleteCategory.emit(this.category.id);
  }

  onArchiveCategory() {}

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

  ngOnInit(): void {}
}
