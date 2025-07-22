import { Routes } from '@angular/router';
import { SearchComponent } from './features/home/components/search/search.component';
import { AuthComponent } from './shared/components/auth/auth.component';

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
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'authentication',
    component: AuthComponent,
  },
];
