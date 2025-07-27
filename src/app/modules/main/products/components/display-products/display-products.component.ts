import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent implements OnInit {

  products: ProductModel[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe(
      (response: ProductModel[]) => {
        this.products = response;
        console.log('Products fetched:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please try again later.');
      }
    );

    this.categoryService.getProductCategories().subscribe(
      (categories: string[]) => {
        console.log('Product categories:', categories);
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching product categories:', error);
        alert('Failed to load product categories. Please try again later.');
      }
    );
  }

}
