import { Routes } from '@angular/router';

export const BOARD_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/my-boards-page/my-boards-page').then((m) => m.MyBoardsPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/board-page/board-page').then((m) => m.BoardPage),
    data: { hideFooter: true, hideHeader: true },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
