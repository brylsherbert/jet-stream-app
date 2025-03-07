import {
  Component,
  Input,
  OnInit,
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
  IonButtons,
  IonBackButton,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonItem,
  IonIcon,
  IonAvatar,
  IonButton,
} from '@ionic/angular/standalone';

import { MovieService } from '../../services/movie.service';
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
  calendarOutline,
  cashOutline,
  caretForwardCircleOutline,
  playSharp,
  chevronBack,
} from 'ionicons/icons';
import { MovieResult } from 'src/app/services/interfaces';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.page.html',
  styleUrls: ['./show-details.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonCardContent,
    IonCardHeader,
    IonText,
    IonCardSubtitle,
    IonCardTitle,
    IonBackButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class ShowDetailsPage {
  private movieService = inject(MovieService);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public tvShow: WritableSignal<MovieService | any> = signal(null);
  public similarMovies: WritableSignal<MovieService | any> = signal(null);
  public similarIsEmpty: boolean = false;
  isExpanded: boolean = false;
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public suggestedMovies: MovieResult[] = [];
  private capacitor = Capacitor;
  platform = this.capacitor.getPlatform();
  similarVideosLength = this.getDynamicSimilarVideosLength();

  @Input()
  set id(showId: string) {
    this.currentPage = 1;

    this.fetchTvShowDetails(showId, this.currentPage);
  }

  constructor() {
    addIcons({ playSharp });
  }

  fetchTvShowDetails(showId: string, page: number): void {
    this.movieService.getTvShowDetails(showId, page).subscribe({
      next: (tvShow) => {
        console.log(tvShow);
        this.tvShow.set(tvShow);

        const { similar, recommendations } = tvShow;
        console.log(similar);
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
      const movieId = this.tvShow().id; // Get the current movieId
      this.fetchTvShowDetails(movieId, this.currentPage);
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
