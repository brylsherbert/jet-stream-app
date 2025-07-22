import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs-container/tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'coming-soon',
        loadComponent: () =>
          import('../features/coming-soon/coming-soon.page').then(
            (m) => m.ComingSoonPage
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../features/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../features/favorites/favorites.page').then(
            (m) => m.FavoritesPage
          ),
      },
      {
        path: '',
        redirectTo: 'tabs-container/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs-container/tabs/home',
    pathMatch: 'full',
  },
];
