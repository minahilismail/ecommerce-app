import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { AdminDashboardComponent } from './modules/main/user/components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './modules/shared/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/main/user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard, adminGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/main/products/products.module').then(
        (m) => m.ProductsModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'categories',
    loadChildren: () =>
      import('./modules/main/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
