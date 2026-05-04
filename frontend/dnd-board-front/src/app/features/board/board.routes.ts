import { Routes } from '@angular/router';

export const BOARD_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/board-list-page/board-list-page').then((m) => m.BoardListPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/board-page/board-page').then((m) => m.BoardPage),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
