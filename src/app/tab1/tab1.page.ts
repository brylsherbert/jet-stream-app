import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { ApiResult, MovieResult } from '../services/interfaces';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';
import { DrawerService } from '../services/drawer.service';
import { addIcons } from 'ionicons';
import {
  caretDownOutline,
  menu,
  menuOutline,
  settings,
  settingsOutline,
  add,
  informationCircleOutline,
  play,
} from 'ionicons/icons';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonIcon,
    IonCol,
    IonRow,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    SharedDirectivesModule,
    ModalPage,
    CommonModule,
    RouterModule,
  ],
})
export class Tab1Page {
  public movieService = inject(MovieService);
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public spotlight: MovieResult[] = [];
  public popularity: any;
  public searchResult: MovieResult[] = [];
  public topRatedTvShows: MovieResult[] = [];
  activeSlideIndex: number = 0;

  constructor(private drawerService: DrawerService) {
    addIcons({
      caretDownOutline,
      menu,
      menuOutline,
      settings,
      settingsOutline,
      add,
      informationCircleOutline,
      play,
    });
    this.loadMovies();

    setTimeout(() => {
      this.getSpotlight();
    }, 100);
  }

  openCategories() {
    throw new Error('Method not implemented.');
  }

  onSlideChange(event: any) {
    this.activeSlideIndex = event.detail.activeIndex;
  }

  onSlideChangeEnd() {
    // Reset activeSlideIndex when reaching the end or moving to the next slide
    this.activeSlideIndex = -1;
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    // TEST MOVIE SERVICE DATA
    // this.movieService.getMovieDetails('693134').subscribe((movies) => {
    //   console.log(movies);
    // });

    this.movieService
      .getTopRatedMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((err: any) => {
          console.log(err);

          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Movie Results: ', res);

          this.movies.push(...res.results);
          console.log('Results: This Movies', this.movies);
          if (event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        },
      });

    // GET SEARCH RESPONSE
    // this.movieService
    //   .getSearchResponse('Barbie')
    //   .pipe(
    //     finalize(() => {
    //       this.isLoading = false;
    //       if (event) {
    //         event.target.complete();
    //       }
    //     }),
    //     catchError((err: any) => {
    //       console.log(err);

    //       this.error = err.error.status_message;
    //       return [];
    //     })
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       console.log('Search Results: ', res);

    //       this.searchResult.push(res);
    //       console.log('Results: This Movies', this.searchResult);
    //     },
    //   });

    // this.error = null;

    // if (!event) {
    //   this.isLoading = true;
    // }

    this.movieService
      .getPopularTvShows()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((err: any) => {
          console.log(err);

          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (res) => {
          console.log('topRatedTvShows Results: ', res);

          this.topRatedTvShows.push(...res.results);
          console.log('Results: This topRatedTvShows', this.topRatedTvShows);
        },
      });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    // this.currentPage++;
    // this.loadMovies(event);
  }

  getSpotlight() {
    setTimeout(() => {
      for (let i = 0, length = 10; i < length; i++) {
        this.spotlight.push(
          this.movies[Math.floor(Math.random() * this.movies.length)]
        );
      }

      const spotlightUnique = new Set(this.spotlight);
      console.log('spotlightUnique', spotlightUnique);

      console.log('Results: Spotlight Movies', this.spotlight);
    }, 100);
  }
}
