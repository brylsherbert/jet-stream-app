import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonButton,
  IonContent,
  IonInput,
  ModalController,
} from '@ionic/angular/standalone';

import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonButton,
    IonBackButton,
    IonButtons,
    IonLabel,
    IonItem,
    IonTitle,
    IonToolbar,
    IonHeader,
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthComponent implements OnInit {
  protected tmdbService = inject(TmdbService);
  private modalController = inject(ModalController);
  private fb = inject(FormBuilder);
  form!: FormGroup;
  requestToken: string = '';

  favorites = this.tmdbService.favorites;
  sessionId = this.tmdbService.sessionId;
  accountDetails = this.tmdbService.accountDetails;

  constructor() {
    addIcons({ arrowBack });
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.sessionId()) {
      this.tmdbService.loadFavorites();
    }
  }

  validateTokenWithLogin() {
    const { username, password } = this.form.value;

    this.tmdbService
      .validateToken(this.requestToken, username, password)
      .subscribe({
        next: (data) => {
          if (data.success) {
            this.createSession(); // Proceed to create session
          }
        },
        error: (error) => {
          console.error('Token validation failed:', error);
        },
      });
  }

  createSession() {
    this.tmdbService.createSession(this.requestToken).subscribe({
      next: (sessionData) => {
        this.tmdbService.sessionId.set(sessionData.session_id); // Update sessionId signal
        this.loadAccountDetails();
      },
      error: (error) => console.error('Failed to create session:', error),
    });
  }

  // Handle callback after user authentication
  handleCallback(verificationToken: string) {
    this.tmdbService.createSession(verificationToken).subscribe({
      next: (sessionData) => {
        console.log('Session created:', sessionData.session_id);
      },
      error: (error) => {
        console.error('Failed to create session:', error);
      },
    });
  }

  loadAccountDetails() {
    this.tmdbService.getAccountDetails(this.sessionId()).subscribe({
      next: (accountData) => {
        this.tmdbService.accountDetails.set(accountData); // Update accountDetails signal
        this.tmdbService.loadFavorites();
      },
      error: (error) =>
        console.error('Failed to fetch account details:', error),
    });
  }

  // Logout process
  logout() {
    this.tmdbService.deleteSession(this.sessionId()).subscribe({
      next: () => this.tmdbService.clearSession(), // Clear session and reset state
      error: (error) => console.error('Failed to delete session:', error),
    });
  }

  dismissModal() {
    return this.modalController.dismiss();
  }
}
