import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { CartModule } from '../main/cart/cart.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDialogComponent } from './components/mat-dialog/mat-dialog.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    SidebarComponent,
    MatDialogComponent,
  ],
  imports: [
    CommonModule,
    CartModule,
    RouterModule.forChild(routes),
    MatSidenavModule,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    DialogComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MatDialogComponent,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LayoutModule {}
