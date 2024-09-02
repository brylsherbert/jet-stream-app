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
import { MovieService } from 'src/app/services/movie.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from 'src/app/services/interfaces';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { ModalPage } from 'src/app/modal/modal.page';
import { DrawerService } from 'src/app/services/drawer.service';
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
export class HomePage {
  private drawerService = inject(DrawerService);
  public movieService = inject(MovieService);
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public spotlight: any;
  public popularity: any;
  public searchResult: MovieResult[] = [];
  public topRatedTvShows: MovieResult[] = [];
  public movieGenres: any[] = [];
  activeSlideIndex: number = 0;

  constructor() {
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
    this.getPopularTVShows();
  }

  openCategories() {
    throw new Error('Method not implemented.');
  }

  onSlideChange(event: any) {
    this.activeSlideIndex = event.detail.activeIndex;
  }

  onSlideChangeEnd() {
    this.activeSlideIndex = -1;
  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {
    (await this.movieService.getTopRatedMovies(this.currentPage))
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
          this.getSpotlight();
          if (event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        },
      });

    this.getMovieGenres();

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
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    // this.currentPage++;
    // this.loadMovies(event);
  }

  async getMovieGenres() {
    this.movieService
      .getMovieGenres()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          console.log(err);

          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Movie Genres: ', res);

          Object.values(res).forEach((key) => {
            this.movieGenres.push(...key);
          });
          console.log('Results: movieGenres', this.movieGenres);
        },
      });

    // setTimeout(() => {
    //   this.spotlight.forEach((element: any) => {
    //     // console.log('ELEMENT: ', element.genre_ids);
    //     element.genre_ids.forEach((id: any) => {
    //       for (let i = 0, length = this.movieGenres.length; i < length; i++) {
    //         if (id === this.movieGenres[i].id) {
    //           element.genre_ids[i] = this.movieGenres[i].name;
    //           console.log('ID: ', id);
    //           console.log('genre.name: ', this.movieGenres);
    //           console.log(
    //             'element.genre_ids[i] = this.movieGenres[i].name; ',
    //             element.genre_ids
    //           );
    //         } else {
    //           continue;
    //         }
    //       }
    //     }, (element.genre_ids = this.spotlight.genre_ids));
    //   });

    //   // console.log('GENRE: spotGenreIds', spotlightVal);
    // }, 1000);
  }

  async getPopularTVShows(event?: InfiniteScrollCustomEvent) {
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

  async getSpotlight() {
    this.spotlight = new Set();
    for (let i = 0, length = 10; i < length; i++) {
      this.spotlight.add(
        this.movies[Math.floor(Math.random() * this.movies.length)]
      );
    }

    console.log('Results: Spotlight Movies', this.spotlight);
  }
}
