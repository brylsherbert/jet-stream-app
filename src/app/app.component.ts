import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { App } from '@capacitor/app';
import { TmdbService } from './services/tmdb.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  private tmdbService = inject(TmdbService);
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (data: any) => {
      console.log('appUrlOpen: ', data);
      const url = data.url;
      if (url.startsWith('myapp://auth')) {
        // Extract the token from the URL
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const verificationToken: any = urlParams.get('request_token'); // Adjust this based on your flow
        // Call your session creation method with this token
        this.handleCallback(verificationToken);
      }
    });
  }

  handleCallback(verificationToken: string) {
    if (verificationToken) {
      // Call your TMDb service to create a session
      this.tmdbService.createSession(verificationToken).subscribe({
        next: (sessionData: any) => {
          console.log('Session created:', sessionData.session_id);
          // Store session ID or handle logged-in state here
          // For example, save to local storage or a state management solution
        },
        error: (error: any) => {
          console.error('Failed to create session:', error);
        },
      });
    } else {
      console.error('Verification token is missing');
    }
  }
}
