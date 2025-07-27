import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { CartModule } from '../main/cart/cart.module';

const routes: Routes = [


];


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    CartModule,
    RouterModule.forChild(routes)],
  exports: [
    DialogComponent,
    HeaderComponent,
    FooterComponent,
  ]
  
})
export class LayoutModule { }
