import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'show-details/:id',
    loadComponent: () =>
      import('./shared/pages/show-details/show-details.page').then(
        (m) => m.ShowDetailsPage
      ),
  },
  {
    path: 'movie-details/:id',
    loadComponent: () =>
      import('./shared/pages/movie-details/movie-details.page').then(
        (m) => m.MovieDetailsPage
      ),
  },
  {
    path: 'category-details',
    loadComponent: () =>
      import('./shared/pages/category-details/category-details.page').then(
        (m) => m.CategoryDetailsPage
      ),
  },
];
