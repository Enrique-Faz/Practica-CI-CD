import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'my-boards',
    loadComponent: () =>
      import('../board/pages/my-boards-page/my-boards-page').then((m) => m.MyBoardsPage),
  },
  {
    path: 'my-characters',
    loadComponent: () =>
      import('../characters/pages/my-characters-page/my-characters-page').then(
        (m) => m.MyCharactersPage,
      ),
  },
];
