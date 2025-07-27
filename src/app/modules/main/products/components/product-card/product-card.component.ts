import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  constructor() { }
  @Input() product: ProductModel={} as ProductModel;

  addToCart() {
    // console.log('Product added to cart:', product);
    alert('Product added to cart successfully!');
  }

  ngOnInit(): void {
  }

}
