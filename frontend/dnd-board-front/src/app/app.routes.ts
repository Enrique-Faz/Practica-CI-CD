import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [guestGuard],
  },
  {
    path: 'board',
    loadChildren: () => import('./features/board/board.routes').then((m) => m.BOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [adminGuard],
  },
  {
    path: '',
    redirectTo: '/board',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
