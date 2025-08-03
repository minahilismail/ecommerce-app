import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { ProductModel } from '../../../products/model/product';
import { Roles } from '../../model/user';
import { DialogAction } from 'src/app/modules/layout/components/dialog/dialog.component';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'],
})
export class ManageProductsComponent implements OnInit {
  @Input() action: DialogAction = 'Edit Product';
  roles = Roles;

  product!: ProductModel;
  products: ProductModel[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter((p) => p.id !== productId);
    });
  }
}
