import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./details/details.page').then((m) => m.DetailsPage),
  },
  {
    path: 'home-defer',
    loadComponent: () =>
      import('./home-defer/home-defer.page').then((m) => m.HomeDeferPage),
  },
  {
    path: 'show-details/:id',
    loadComponent: () =>
      import('./show-details/show-details.page').then((m) => m.ShowDetailsPage),
  },
];
