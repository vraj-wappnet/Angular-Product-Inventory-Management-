import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'appointments',
        loadChildren: () =>
          import('./features/appointments/appointments.module').then(
            (m) => m.AppointmentsModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AuthGuard, AdminGuard],
      },
    ],
  },
];
