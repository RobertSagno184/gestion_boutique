import { Routes } from '@angular/router';
import { DailyReportPageComponent } from './pages/daily-report.page';

export const reportsRoutes: Routes = [
  {
    path: 'daily',
    component: DailyReportPageComponent
  },
  {
    path: '',
    redirectTo: 'daily',
    pathMatch: 'full'
  }
];
