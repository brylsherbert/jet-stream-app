import {
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
  IonButtons,
  IonBackButton,
  IonCard,
  IonLabel,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
  IonItem,
  IonIcon,
  IonCardContent,
  IonCardHeader,
  IonButton,
  InfiniteScrollCustomEvent,
  IonAvatar,
  IonBadge,
} from '@ionic/angular/standalone';
import { MovieService } from '../../services/movie.service';

import { addIcons } from 'ionicons';
import { cashOutline, playSharp } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonAvatar,
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
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class MovieDetailsPage {
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

  @Input()
  set id(movieId: string) {
    this.currentPage = 1;
    this.fetchMovieDetails(movieId, this.currentPage);
  }

  constructor() {
    addIcons({ playSharp, cashOutline });
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
}
