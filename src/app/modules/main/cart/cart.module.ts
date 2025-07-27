import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayCartItemsComponent } from './components/display-cart-items/display-cart-items.component';
import { LayoutModule } from '../../layout/layout.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DisplayCartItemsComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule
  ]
})
export class CartModule { }
