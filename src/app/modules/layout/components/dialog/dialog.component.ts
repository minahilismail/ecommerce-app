import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductFormComponent } from 'src/app/modules/main/products/components/product-form/product-form.component';
import { ProductModel } from 'src/app/modules/main/products/model/product';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Input() action: string = "Add Product";
  @Input() product: ProductModel | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  private modalService = inject(NgbModal);

	open() {
		const modalRef = this.modalService.open(ProductFormComponent);
		modalRef.componentInstance.action = this.action;
    modalRef.componentInstance.product = this.product;
	}

}
