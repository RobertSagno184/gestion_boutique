import { Routes } from '@angular/router';
import { ProductsPageComponent } from './pages/products.page';
import { ProductFormPageComponent } from './pages/product-form.page';
import { StockEntryPageComponent } from './pages/stock-entry.page';

export const inventoryRoutes: Routes = [
  {
    path: 'products',
    component: ProductsPageComponent
  },
  {
    path: 'products/new',
    component: ProductFormPageComponent
  },
  {
    path: 'products/:id',
    component: ProductFormPageComponent
  },
  {
    path: 'stock',
    component: StockEntryPageComponent
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];
