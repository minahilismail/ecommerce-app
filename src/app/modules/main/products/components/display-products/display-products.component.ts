import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { Roles } from '../../../user/model/user';
import { CategoryModel } from '../../../categories/model/category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css'],
})
export class DisplayProductsComponent implements OnInit {
  products: ProductModel[] = [];
  categories: CategoryModel[] = [];
  // categoriesOb: any;
  searchQuery: string = '';
  selectedCategory: string = '';
  roles = Roles;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    console.log('DisplayProductsComponent constructor called');
  }

  ngOnInit() {
    console.log('DisplayProductsComponent ngOnInit called');
    console.log('Current URL:', window.location.href);
    this.productService.getAllProducts().subscribe(
      (response: ProductModel[]) => {
        this.products = response;
        console.log('Products fetched:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
        Swal.fire(
          'Error!',
          'Failed to load products. Please try again later.',
          'error'
        );
      }
    );

    this.categoryService.getProductCategories().subscribe(
      (categories: CategoryModel[]) => {
        console.log('Product categories:', categories);
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching product categories:', error);
        Swal.fire(
          'Error!',
          'Failed to load product categories. Please try again later.',
          'error'
        );
      }
    );
  }
}
