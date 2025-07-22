import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonSearchbar,
  IonBackButton,
  IonGrid,
  IonCol,
  IonRow,
  IonAvatar,
  IonLabel,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonIcon,
  IonCard,
  IonList,
  IonText,
  IonInfiniteScroll,
  IonSkeletonText,
  IonAlert,
  IonBadge,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { catchError, finalize } from 'rxjs';
import { ApiResult, MovieResult } from '../../../../shared/services/interfaces';
import {
  add,
  calendarOutline,
  caretDownOutline,
  caretForwardCircleOutline,
  cashOutline,
  informationCircleOutline,
  menu,
  menuOutline,
  play,
  settings,
  settingsOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MovieService } from '../../../../shared/services/movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [
    IonInfiniteScrollContent,
    IonBadge,
    IonAlert,
    IonSkeletonText,
    IonInfiniteScroll,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    DatePipe,
    RouterModule,
    IonBackButton,
  ],
})
export class SearchComponent {
  @ViewChild('searchInput') myInput: any;
  public movie_service = inject(MovieService);
  public image_base_url = 'https://image.tmdb.org/t/p';
  search_response: MovieResult[] = [];
  current_page = 1;
  isLoading = false;
  error = null;
  isEmpty: boolean = false;
  isSearching = false;
  currentSearchQuery: string = '';

  public dummyArray = new Array(10);
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
      calendarOutline,
      cashOutline,
      caretForwardCircleOutline,
    });
  }

  getSearchResults(searchInput: any, event?: InfiniteScrollCustomEvent) {
    console.log('MYINPUT', this.myInput.lastValue);
    this.isSearching = true;
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    if (!searchInput) {
      this.resetSearchResults();
      return;
    }

    if (this.currentSearchQuery !== searchInput) {
      this.resetSearchResults();
      this.currentSearchQuery = searchInput; // Update the current search query
    }

    this.movie_service
      .getSearchResponse<MovieResult>(this.current_page, searchInput)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isSearching = false;
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
        next: (response: ApiResult<MovieResult>) => {
          if (this.current_page === 1) {
            this.search_response = [...response.results];
          } else {
            this.search_response.push(...response.results);
          }
          console.log('Search: Response response', response);
          console.log('Search: Response', searchInput);

          if (response.total_results === 0) {
            this.isEmpty = true;
          }

          if (event) {
            event.target.disabled =
              response.total_results === this.search_response.length;
          }
        },
      });
  }

  loadMore(searchInput: any, event?: InfiniteScrollCustomEvent) {
    this.current_page++;
    this.getSearchResults(searchInput, event);
  }

  resetSearchResults() {
    this.myInput.lastValue = '';
    this.current_page = 1;
    this.isLoading = false;
    this.search_response = [];
    this.isEmpty = false;
  }
}
