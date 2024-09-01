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
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'coming-soon',
        loadComponent: () =>
          import('../coming-soon/coming-soon.page').then(
            (m) => m.ComingSoonPage
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'download',
        loadComponent: () =>
          import('../download/download.page').then((m) => m.DownloadPage),
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
