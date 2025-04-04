import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ServiceManagementComponent } from './components/service-management/service-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'services', component: ServiceManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
