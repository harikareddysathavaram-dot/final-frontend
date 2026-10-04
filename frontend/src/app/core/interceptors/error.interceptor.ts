import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Auto logout if 401 response returned from api
        authService.logout().subscribe();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden
        router.navigate(['/']); // Or a specific forbidden page
      }
      
      const errorMsg = error.error?.message || error.statusText;
      return throwError(() => new Error(errorMsg));
    })
  );
};
