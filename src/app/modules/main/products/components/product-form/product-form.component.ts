import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  activeModal = inject(NgbActiveModal);

  @Input() action: string = "edit";

  
  isLoading = false;
  constructor(private productService: ProductService) {}

  addProduct(formValue: any) {
    console.log('Product added with:', formValue);
    this.isLoading = true;
    this.productService.addProduct(formValue).subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again later.');
        this.isLoading = false;
      }
    );
  }


  ngOnInit(): void {
  }

}
