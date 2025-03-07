import { CommonModule } from '@angular/common';
import {
  ApiResult,
  UpcomingMoviesData,
  UpcomingMoviesResult,
} from './../../app/services/interfaces';
import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonSegment,
  IonGrid,
  IonRow,
  IonList,
  IonIcon,
  IonCol, IonSkeletonText } from '@ionic/angular/standalone';
import { catchError, finalize } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { Capacitor } from '@capacitor/core';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { TmdbService } from 'src/app/services/tmdb.service';
import {
  informationCircle,
  play,
  playOutline,
  informationCircleOutline,
  heartOutline,
  heart,
} from 'ionicons/icons';

@Component({
  selector: 'app-coming-soon',
  templateUrl: 'coming-soon.page.html',
  styleUrls: ['coming-soon.page.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonCol,
    IonIcon,
    IonRow,
    IonGrid,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    RouterModule,
  ],
})
export class ComingSoonPage {
  private tmdbService = inject(TmdbService);
  private movieService = inject(MovieService);
  private capacitor = Capacitor;
  platform = this.capacitor.getPlatform();
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public upcomingMovies: UpcomingMoviesData[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public spotlight: any;
  public popularity: any;
  public movieGenres: any[] = [];
  activeSlideIndex: number = 0;
  slidesPerView: number = 3.3;
  objectFit: string = '';
  spotlightHeight: string = '';
  spotlightImageSize: string = '';
  thumbnailSize: string = '';
  accountDetails: any;

  constructor() {
    addIcons({
      playOutline,
      informationCircleOutline,
      play,
      informationCircle,
      heartOutline,
      heart,
    });
    this.getUpcomingMovies();
  }

  ionViewWillEnter() {
    this.accountDetails = this.tmdbService.accountDetails()?.id;
    console.log('Account Details: ', this.accountDetails);
  }

  async getUpcomingMovies(event?: InfiniteScrollCustomEvent) {
    this.isLoading = true;
    this.movieService
      .getMovies<UpcomingMoviesData>('upcoming', this.currentPage)
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
        next: (res: ApiResult<UpcomingMoviesData>) => {
          console.log('Upcoming Movie Results: ', res);

          this.upcomingMovies.push(...res.results);
          console.log('Results: This Upcoming Movies', this.upcomingMovies);
          if (event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        },
      });
  }

  async initializePlatform() {
    const getSlidesPerView = async () => {
      if (this.platform === 'web') {
        this.slidesPerView = 9;
      } else {
        this.slidesPerView = 3.3;
      }
    };

    const getSpotlightContainerHeight = async () => {
      if (this.platform === 'web') {
        this.spotlightHeight = '95vh';
      } else {
        this.spotlightHeight = '80vh';
      }
    };

    const getImageObjectFit = async () => {
      if (this.platform === 'web') {
        this.objectFit = 'cover';
      } else {
        this.objectFit = 'cover';
      }
    };

    const getImageSize = async () => {
      if (this.platform === 'web') {
        this.spotlightImageSize = '/original';
      } else {
        this.spotlightImageSize = '/w780';
      }
    };

    const getThubmnailSize = async () => {
      if (this.platform === 'web') {
        this.thumbnailSize = '/w780';
      } else {
        this.thumbnailSize = '/w342';
      }
    };

    await Promise.all([
      getSlidesPerView(),
      getSpotlightContainerHeight(),
      getImageObjectFit(),
      getImageSize(),
      getThubmnailSize(),
    ]);
  }

  // Method to toggle favorite status
  toggleFavorite(movieId: any) {
    const isCurrentlyFavorite = this.tmdbService
      .favorites()
      .some((favorite) => favorite.id === movieId);

    this.tmdbService
      .markAsFavorite(
        this.tmdbService.accountDetails()?.id,
        'movie',
        movieId,
        !isCurrentlyFavorite
      )
      .subscribe({
        next: () => {
          this.tmdbService.loadFavorites(); // Reload favorites to update the list
        },
        error: (error) => {
          console.error('Failed to toggle favorite:', error);
        },
      });
  }

  isFavorite(movieId: any): boolean {
    return this.tmdbService
      .favorites()
      .some((favorite) => favorite.id === movieId);
  }
}
