import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { convertKeysToSnakeCase } from '../utils/case-converter.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.currentUser()?.token;

  let headers = req.headers.set('Accept', 'application/json');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  let clonedReq = req;
  if (req.body && typeof req.body === 'object') {
    headers = headers.set('Content-Type', 'application/json');
    const newBody = convertKeysToSnakeCase(req.body);
    clonedReq = req.clone({ headers, body: newBody });
  } else {
    clonedReq = req.clone({ headers });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    }),
  );
};
