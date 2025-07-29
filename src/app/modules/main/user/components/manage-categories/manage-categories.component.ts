import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../../categories/model/category';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css'],
})
export class ManageCategoriesComponent implements OnInit {
  categories: string[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getProductCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
}
