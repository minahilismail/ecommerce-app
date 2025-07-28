import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
];

export class UserRoutingModule {}

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class UserModule {}
