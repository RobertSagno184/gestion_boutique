import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login.page';
import { RegisterPageComponent } from './pages/register.page';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
