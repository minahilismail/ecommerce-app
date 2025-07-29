import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.css'],
})
export class DashboardStatsComponent implements OnInit {
  productCount: number = 0;
  categoryCount: number = 0;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchCounts();
  }
  // Method to fetch product and category counts
  fetchCounts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.productCount = products.length;
    });

    this.categoryService.getProductCategories().subscribe((categories) => {
      this.categoryCount = categories.length;
    });
  }
}
