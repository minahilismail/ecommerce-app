import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { CartModule } from '../main/cart/cart.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
const routes: Routes = [];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    CartModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
  ],
  exports: [
    DialogComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
})
export class LayoutModule {}
