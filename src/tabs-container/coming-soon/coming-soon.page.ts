import { UpcomingMoviesResult } from './../../app/services/interfaces';
import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { catchError, finalize } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: 'coming-soon.page.html',
  styleUrls: ['coming-soon.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class ComingSoonPage {
  private movieService = inject(MovieService);
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public upcomingMovies: UpcomingMoviesResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public spotlight: any;
  public popularity: any;
  public movieGenres: any[] = [];
  activeSlideIndex: number = 0;
  constructor() {
    this.getUpcomingMovies();
  }

  async getUpcomingMovies(event?: InfiniteScrollCustomEvent) {
    (await this.movieService.getMovies('upcoming', this.currentPage))
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
          console.log('Upcoming Movie Results: ', res);

          this.upcomingMovies.push(...res.results);
          console.log('Results: This Upcoming Movies', this.upcomingMovies);
          if (event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        },
      });
  }
}
