import { Component, ViewChild, inject } from '@angular/core';
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
import { MovieResult } from 'src/app/services/interfaces';
import { MovieService } from 'src/app/services/movie.service';
import { addIcons } from 'ionicons';
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
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScrollContent,
    IonBadge,
    IonAlert,
    IonSkeletonText,
    IonInfiniteScroll,
    IonText,
    IonList,
    IonCard,
    IonIcon,
    IonItem,
    IonCardSubtitle,
    IonCardTitle,
    IonLabel,
    IonAvatar,
    IonRow,
    IonCol,
    IonGrid,
    IonBackButton,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    DatePipe,
    RouterModule,
  ],
})
export class SearchPage {
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
      .getSearchResponse(this.current_page, searchInput)
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
        next: (response) => {
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
