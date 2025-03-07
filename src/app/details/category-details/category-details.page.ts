import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.page.html',
  styleUrls: ['./category-details.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class CategoryDetailsPage {
  public router = inject(Router);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  currentObject: any = null;
  categoryTitle: string = '';

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const myObject = JSON.parse(navigation?.extras?.state['data']);
      const catTitle = navigation?.extras?.state['categoryTitle'];
      console.log('categoryTitle:', catTitle);

      if (myObject?.length && catTitle?.length > 0) {
        this.currentObject = myObject;
        this.categoryTitle = catTitle;
      }
    }
  }
}
