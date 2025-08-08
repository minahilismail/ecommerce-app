import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { DisplayProductsComponent } from '../products/components/display-products/display-products.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { ChildCategoryComponent } from './components/child-category/child-category.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        component: DashboardStatsComponent,
      },
      {
        path: 'manage-products',
        component: ManageProductsComponent,
      },
      {
        path: 'manage-categories',
        component: ManageCategoriesComponent,
      },
    ],
  },
  // {
  //   path: 'categories',
  //   component: DisplayCategoriesComponent,
  // }
];

export class UserRoutingModule {}

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageCategoriesComponent,
    DashboardStatsComponent,
    ChildCategoryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    LayoutModule,
    FormsModule,
  ],
})
export class UserModule {}
