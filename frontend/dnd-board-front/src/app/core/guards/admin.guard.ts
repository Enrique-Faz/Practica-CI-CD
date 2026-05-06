import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

import { AuthService } from '../../features/auth/shared/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.currentUser();

  if (user?.user.role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
