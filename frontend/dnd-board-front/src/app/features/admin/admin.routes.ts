import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats-page/stats-page').then((m) => m.StatsPage),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users-page/users-page').then((m) => m.UsersPage),
  },
  {
    path: 'boards',
    loadComponent: () => import('./pages/boards-page/boards-page').then((m) => m.BoardsPage),
  },
  {
    path: '',
    redirectTo: 'stats',
    pathMatch: 'full',
  },
];
