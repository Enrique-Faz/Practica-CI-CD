import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats-page/stats-page').then((m) => m.StatsPage),
  },
  {
    path: 'manage',
    loadComponent: () => import('./pages/manage-page/manage-page').then((m) => m.ManagePage),
  },
  {
    path: '',
    redirectTo: 'stats',
    pathMatch: 'full',
  },
];
