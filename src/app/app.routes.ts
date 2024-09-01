import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../tabs-container/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home-defer',
    loadComponent: () =>
      import('./home-defer/home-defer.page').then((m) => m.HomeDeferPage),
  },
  {
    path: 'show-details/:id',
    loadComponent: () =>
      import('./details/show-details/show-details.page').then(
        (m) => m.ShowDetailsPage
      ),
  },
  {
    path: 'movie-details/:id',
    loadComponent: () =>
      import('./details/movie-details/movie-details.page').then(
        (m) => m.MovieDetailsPage
      ),
  },
];
