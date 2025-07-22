import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonLabel,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
  IonItem,
  IonIcon,
  IonCardContent,
  IonCardHeader,
  IonButtons,
  IonBackButton,
  IonButton,
  IonAvatar,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { MovieService } from '../../services/movie.service';
import { TmdbService } from 'src/app/shared/services/tmdb.service';

import { addIcons } from 'ionicons';
import {
  cashOutline,
  heart,
  heartOutline,
  playSharp,
  calendarOutline,
  volumeHighOutline,
  volumeMuteOutline,
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonButton,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonItem,
    IonText,
    IonCardSubtitle,
    IonCardTitle,
    IonLabel,
    IonCard,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MovieDetailsPage {
  private tmdbService = inject(TmdbService);
  private movieService = inject(MovieService);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public movie: WritableSignal<MovieService | any> = signal(null);
  public similarMovies: WritableSignal<MovieService | any> = signal(null);
  isExpanded: boolean = false;
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public similarIsEmpty: boolean = false;
  private capacitor = Capacitor;
  platform = this.capacitor.getPlatform();
  similarVideosLength = this.getDynamicSimilarVideosLength();
  sessionId: any;
  accountDetails: any;
  isVideoPlaying = false;
  isVideoMuted: boolean = true;
  shouldPlayVideo: boolean = false;

  @Input()
  set id(movieId: string) {
    this.currentPage = 1;
    this.fetchMovieDetails(movieId, this.currentPage);
  }

  constructor() {
    addIcons({
      playSharp,
      calendarOutline,
      cashOutline,
      heartOutline,
      heart,
      volumeHighOutline,
      volumeMuteOutline,
    });

    this.accountDetails = this.tmdbService.accountDetails()?.id;
    console.log('Account Details: ', this.accountDetails);
  }

  fetchMovieDetails(movieId: string, page: number): void {
    this.movieService.getMovieDetails(movieId, page).subscribe({
      next: (movie) => {
        console.log(movie);
        this.movie.set(movie);

        const { similar, recommendations } = movie;

        this.similarIsEmpty = !similar.results.length;
        this.similarMovies.set(this.similarIsEmpty ? recommendations : similar);

        this.isLoading = false;
        this.loadVideoListeners();
      },
      error: (err) => {
        console.error('Failed to fetch movie details:', err);
        this.error = err;
        this.isLoading = false;
      },
    });
  }

  public changePage(page: number): void {
    if (page > 0 && page <= (this.similarMovies()?.total_pages || 0)) {
      this.currentPage = page;
      const movieId = this.movie().id; // Get the current movieId
      this.fetchMovieDetails(movieId, this.currentPage);
    }
  }

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  getDynamicSimilarVideosLength() {
    if (this.platform === 'web') {
      return 20;
    } else {
      return 12;
    }
  }

  // Method to toggle favorite status
  toggleFavorite(movieId: number) {
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

  // Check if the movie is already a favorite
  isFavorite(movieId: number): boolean {
    return this.tmdbService
      .favorites()
      .some((favorite) => favorite.id === movieId);
  }

  async handleVideoPlay() {
    const videos = document.querySelectorAll('video');
    const currentElement = videos[videos.length - 1];
    if (videos) {
      currentElement?.paused ? currentElement?.play() : currentElement?.pause();
    }
  }

  toogleMuteVideo() {
    const videos = document.querySelectorAll('video');
    const currentElement = videos[videos.length - 1];

    if (currentElement?.muted === true) {
      currentElement.muted = false;
      this.isVideoMuted = false;
    } else {
      currentElement.muted = true;
      this.isVideoMuted = true;
    }
  }

  async ionViewDidEnter() {
    setTimeout(() => {
      if (this.movie()) {
        const videos = document.querySelectorAll('video');
        const currentElement = videos[videos.length - 1];

        if (currentElement?.paused) {
          currentElement.play();
        }
      }
    }, 2000);
  }

  ionViewWillLeave() {
    this.shouldPlayVideo = false;

    const videos = document.querySelectorAll('video');
    videos.forEach((video: HTMLVideoElement, index) => {
      if (!video?.paused) {
        console.log(`Video #${index} Paused!`);
        video?.pause();
      }
    });

    this.unLoadEventListeners();
  }

  loadVideoListeners() {
    setTimeout(() => {
      this.shouldPlayVideo = true;
      const videos = document.querySelectorAll('video');
      const currentElement = videos[videos.length - 1];

      if (currentElement) {
        const playHandler = () => {
          this.isVideoPlaying = true;
        };

        const pauseHandler = () => {
          this.isVideoPlaying = false;
        };

        currentElement.addEventListener('play', playHandler);

        currentElement.addEventListener('pause', pauseHandler);
      }
    }, 50);
  }

  unLoadEventListeners() {
    const videos = document.querySelectorAll('video');
    const currentElement = videos[videos.length - 1];

    if (currentElement) {
      currentElement.removeEventListener('play', this.playHandler);
      currentElement.removeEventListener('pause', this.pauseHandler);
    }
  }

  playHandler() {
    this.isVideoPlaying = true;
  }

  pauseHandler() {
    this.isVideoPlaying = false;
  }
}
