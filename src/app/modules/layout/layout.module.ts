import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [


];


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes)],
  exports: [
    DialogComponent,
    HeaderComponent,
    FooterComponent,
  ]
  
})
export class LayoutModule { }
