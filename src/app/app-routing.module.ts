import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { NotFoundComponent } from './modules/shared/components/not-found/not-found.component';
import { DisplayProductsComponent } from './modules/main/products/components/display-products/display-products.component';
import { DisplayCartItemsComponent } from './modules/main/cart/components/display-cart-items/display-cart-items.component';
import { RoleGuard } from './modules/shared/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: DisplayProductsComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/main/user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/main/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'categories',
    loadChildren: () =>
      import('./modules/main/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'cart',
  //   loadChildren: () =>
  //     import('./modules/main/cart/cart.module').then((m) => m.CartModule),
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'cart',
    component: DisplayCartItemsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
