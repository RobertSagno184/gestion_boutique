import { Routes } from '@angular/router';
import { NewSalePageComponent } from './pages/new-sale.page';
import { SalesHistoryPageComponent } from './pages/sales-history.page';

export const salesRoutes: Routes = [
  {
    path: 'new',
    component: NewSalePageComponent
  },
  {
    path: '',
    component: SalesHistoryPageComponent
  }
];
