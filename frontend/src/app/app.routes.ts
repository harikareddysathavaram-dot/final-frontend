import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register-employer',
        loadComponent: () => import('./features/auth/register-employer/register-employer.component').then(m => m.RegisterEmployerComponent)
      },
      {
        path: 'register-surveyor',
        loadComponent: () => import('./features/auth/register-surveyor/register-surveyor.component').then(m => m.RegisterSurveyorComponent)
      },
      // Dashboards (Protected)
      {
        path: 'admin/dashboard',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'] },
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'employer/dashboard',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Employer'] },
        loadComponent: () => import('./features/employer/dashboard/dashboard.component').then(m => m.EmployerDashboardComponent)
      },
      {
        path: 'surveyor/dashboard',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Surveyor'] },
        loadComponent: () => import('./features/surveyor/dashboard/dashboard.component').then(m => m.SurveyorDashboardComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
