import {
  Component,
  inject,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryFormComponent } from 'src/app/modules/main/categories/components/category-form/category-form.component';
import { CategoryModel } from 'src/app/modules/main/categories/model/category';
import { ProductFormComponent } from 'src/app/modules/main/products/components/product-form/product-form.component';
import { ProductModel } from 'src/app/modules/main/products/model/product';

export type DialogAction =
  | 'Add Product'
  | 'Update Product'
  | 'Add Category'
  | 'Update Category'
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

  @Output() productUpdated = new EventEmitter<void>();
  @Output() categoryUpdated = new EventEmitter<void>();
  constructor() {}

  icons: { [K in DialogAction]: string } = {
    'Add Product': 'plus-circle',
    'Update Product': 'pencil',
    'Add Category': 'plus-circle',
    'Update Category': 'pencil-square',
    'Add SubCategory': 'plus-circle',
  };

  // Getter method to safely access icons
  getIcon(): string {
    return this.icons[this.action] || 'question-circle';
  }

  ngOnInit(): void {}

  private modalService = inject(NgbModal);

  open() {
    const isProductAction =
      this.action === 'Add Product' || this.action === 'Update Product';

    const modalRef = this.modalService.open(
      isProductAction ? ProductFormComponent : CategoryFormComponent
    );
    modalRef.componentInstance.action = this.action;
    if (isProductAction) {
      modalRef.componentInstance.product = this.product;
    } else {
      modalRef.componentInstance.category = this.category;
      modalRef.componentInstance.parentCategory = this.parentCategory;
    }

    // Listen for modal result and emit appropriate event
    modalRef.result
      .then((result) => {
        if (result === 'added' || result === 'updated') {
          if (isProductAction) {
            this.productUpdated.emit();
          } else {
            this.categoryUpdated.emit();
          }
        }
      })
      .catch(() => {});
  }
}
