import { Routes } from '@angular/router';
import { ExpensesListPageComponent } from './pages/expenses-list.page';
import { NewExpensePageComponent } from './pages/new-expense.page';

export const expensesRoutes: Routes = [
  {
    path: '',
    component: ExpensesListPageComponent
  },
  {
    path: 'new',
    component: NewExpensePageComponent
  }
];
