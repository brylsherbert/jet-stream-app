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
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.page.html',
  styleUrls: ['./show-details.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ShowDetailsPage {
  private movieService = inject(MovieService);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public tvShow: WritableSignal<MovieService | any> = signal(null);

  @Input()
  set id(showId: string) {
    this.movieService.getTvShowDetails(showId).subscribe((tvShow) => {
      console.log(tvShow);

      this.tvShow.set(tvShow);
    });
  }

  constructor() {}

  ngOnInit() {}
}
