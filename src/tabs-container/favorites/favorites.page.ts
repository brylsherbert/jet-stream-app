import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, IonButton, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { TmdbService } from 'src/app/services/tmdb.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonItem, IonButton, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FavoritesPage {
  private tmdbService = inject(TmdbService);
  favorites = this.tmdbService.favorites;
  sessionId = this.tmdbService.sessionId;
  accountDetails = this.tmdbService.accountDetails;
  constructor() {}

  ngOnInit() {
    if (this.sessionId()) {
      this.tmdbService.loadFavorites();
    }

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log('Favorites: ', this.favorites());
    
  }

  addFavorite(mediaType: string, mediaId: number, favorite: boolean) {
    const accountId = this.accountDetails()?.id;
    if (accountId) {
      this.tmdbService
        .markAsFavorite(accountId, mediaType, mediaId, favorite)
        .subscribe({
          next: () => this.tmdbService.loadFavorites(), // Reload favorites after update
          error: (error) => console.error('Failed to mark as favorite:', error),
        });
    }
  }
}
