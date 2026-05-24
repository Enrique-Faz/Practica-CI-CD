import { Routes } from '@angular/router';

export const NUEVA_PAGINA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/nueva-pagina-page/nueva-pagina-page').then((m) => m.NuevaPaginaPage),
  },
];
