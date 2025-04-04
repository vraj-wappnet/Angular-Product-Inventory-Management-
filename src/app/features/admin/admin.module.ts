// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { AdminRoutingModule } from './admin-routing.module';

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule,
//     AdminRoutingModule
//   ]
// })
// export class AdminModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    FormsModule, // For ngModel
    AdminRoutingModule,
  ],
})
export class AdminModule {}
