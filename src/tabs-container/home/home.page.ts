import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
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
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { ApiResult, MovieResult } from 'src/app/services/interfaces';
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
  chevronForward,
} from 'ionicons/icons';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

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
    ModalPage,
    CommonModule,
    RouterModule,
    SharedDirectivesModule,
  ],
})
export class HomePage implements OnInit {
  private drawerService = inject(DrawerService);
  public movieService = inject(MovieService);
  public currentPage = 1;
  public error: string | null = null;
  public isLoading = false;
  public popularMovies: MovieResult[] = [];
  public topRatedMovies: MovieResult[] = [];
  public nowPlayingMovies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public spotlight: any;
  public popularity: any;
  public searchResult: MovieResult[] = [];
  public topRatedTvShows: MovieResult[] = [];
  public movieGenres: any[] = [];
  activeSlideIndex: number = 0;
  public router = inject(Router);
  private capacitor = Capacitor;
  platform = this.capacitor.getPlatform();
  slidesPerView: number = 3.3;
  objectFit: string = '';
  spotlightHeight: string = '';
  spotlightImageSize: string = '';
  thumbnailSize: string = '';

  constructor() {
    addIcons({
      menuOutline,
      settings,
      caretDownOutline,
      add,
      play,
      informationCircleOutline,
      chevronForward,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initializePlatform();
    console.log('Platform: ', this.platform);
    console.log('Slides Per View: ', this.slidesPerView);
    console.log('Object Fit: ', this.objectFit);
    console.log('Spotlight Height: ', this.spotlightHeight);
    console.log('Spotlight Image Size: ', this.spotlightImageSize);
    console.log('Thumbnail Image Size: ', this.thumbnailSize);
    this.loadMovies('popular');
    this.loadMovies('top_rated');
    this.loadMovies('now_playing');
    this.getPopularTVShows();
  }

  private handleResponse(
    category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming',
    results: MovieResult[],
    totalPages: number
  ): void {
    switch (category) {
      case 'popular':
        this.popularMovies.push(...results);
        this.getSpotlight();
        console.log('Results: popularMovies', this.popularMovies);
        break;
      case 'top_rated':
        this.topRatedMovies.push(...results);
        console.log('Results: topRatedMovies', this.topRatedMovies);
        break;
      case 'now_playing':
        this.nowPlayingMovies.push(...results);
        console.log('Results: nowPlayingMovies', this.nowPlayingMovies);
        break;
    }
  }

  loadMovies(
    movieType: 'popular' | 'top_rated' | 'now_playing' | 'upcoming'
  ): void {
    this.isLoading = true;
    this.movieService.getMovies<MovieResult>(movieType).subscribe({
      next: (res: ApiResult<MovieResult>) => {
        this.handleResponse(movieType, res.results, res.total_pages);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load movies.';
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
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
  }

  async getPopularTVShows(event?: InfiniteScrollCustomEvent) {
    this.movieService
      .getPopularTvShows<MovieResult>()
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
        next: (res: ApiResult<MovieResult>) => {
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
        this.popularMovies[
          Math.floor(Math.random() * this.popularMovies.length)
        ]
      );
    }

    console.log('Results: Spotlight Movies', this.spotlight);
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

  seeAllCategoryData(data: any, catTitle: string) {
    this.router.navigate(['/category-details'], {
      state: { data: JSON.stringify(data), categoryTitle: catTitle },
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
      this.objectFit = 'cover'; // Same for both platforms
    };

    const getImageSize = async () => {
      if (this.platform === 'web') {
        this.spotlightImageSize = '/w1280';
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
}
