import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryFormComponent } from 'src/app/modules/main/categories/components/category-form/category-form.component';
import { CategoryModel } from 'src/app/modules/main/categories/model/category';
import { ProductFormComponent } from 'src/app/modules/main/products/components/product-form/product-form.component';
import { ProductModel } from 'src/app/modules/main/products/model/product';

export type DialogAction =
  | 'Add Product'
  | 'Edit Product'
  | 'Add Category'
  | 'Edit Category'
  | 'Add SubCategory';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  @Input() action: DialogAction = 'Add Product'; // Remove | string and set default
  @Input() product: ProductModel | null = null;
  @Input() category: CategoryModel | null = null;
  @Input() parentCategory: CategoryModel | null = null;

  constructor() {}

  icons: { [K in DialogAction]: string } = {
    'Add Product': 'plus-circle',
    'Edit Product': 'pencil',
    'Add Category': 'plus-circle',
    'Edit Category': 'pencil-square',
    'Add SubCategory': 'plus-circle',
  };

  // Getter method to safely access icons
  getIcon(): string {
    return this.icons[this.action] || 'question-circle';
  }

  ngOnInit(): void {}

  private modalService = inject(NgbModal);

  open() {
    const modalRef = this.modalService.open(
      this.action === 'Add Product' || this.action === 'Edit Product'
        ? ProductFormComponent
        : CategoryFormComponent
    );
    modalRef.componentInstance.action = this.action;
    modalRef.componentInstance.product = this.product;
    modalRef.componentInstance.category = this.category;
    modalRef.componentInstance.parentCategory = this.parentCategory;
  }
}
