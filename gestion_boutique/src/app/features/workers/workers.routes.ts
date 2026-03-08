import { Routes } from '@angular/router';
import { WorkersPageComponent } from './pages/workers.page';
import { WorkerFormPageComponent } from './pages/worker-form.page';
import { WorkerPaymentsPageComponent } from './pages/worker-payments.page';

export const workersRoutes: Routes = [
  {
    path: '',
    component: WorkersPageComponent
  },
  {
    path: 'new',
    component: WorkerFormPageComponent
  },
  {
    path: ':id/edit',
    component: WorkerFormPageComponent
  },
  {
    path: ':id/payments',
    component: WorkerPaymentsPageComponent
  }
];
