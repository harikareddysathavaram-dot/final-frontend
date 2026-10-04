import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const userRole = authService.role;
  const expectedRoles = route.data['roles'] as Array<string>;

  if (userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  // Redirect based on role if unauthorized for the target route
  if (userRole === 'Admin') {
    router.navigate(['/admin/dashboard']);
  } else if (userRole === 'Employer') {
    router.navigate(['/employer/dashboard']);
  } else if (userRole === 'Surveyor') {
    router.navigate(['/surveyor/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};
