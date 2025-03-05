import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { DepartmentManagementComponent } from './pages/department-management/department-management.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeeManagementComponent, canActivate: [authGuard] },
  { path: 'departments', component: DepartmentManagementComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
