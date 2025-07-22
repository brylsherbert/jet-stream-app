import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);
  private authUrl = 'https://api.themoviedb.org/3/authentication';
  private apiUrl = 'https://api.themoviedb.org/3';

  // Signals for session and account details, with initial localStorage values
  sessionId = signal<string | null>(localStorage.getItem('sessionId'));
  accountDetails = signal<any | null>(
    JSON.parse(localStorage.getItem('accountDetails') || 'null')
  );

  constructor() {
    // Effect to update sessionId in localStorage when it changes
    effect(() => {
      const sessionId = this.sessionId();
      sessionId
        ? localStorage.setItem('sessionId', sessionId)
        : localStorage.removeItem('sessionId');
    });

    // Effect to update accountDetails in localStorage when it changes
    effect(() => {
      const accountDetails = this.accountDetails();
      accountDetails
        ? localStorage.setItem('accountDetails', JSON.stringify(accountDetails))
        : localStorage.removeItem('accountDetails');
    });
  }

  // In your service
  getNewRequestToken(): Observable<any> {
    return this.http.get(`${this.authUrl}/token/new?api_key=${API_KEY}`, {
      headers: new HttpHeaders({ accept: 'application/json' }),
    });
  }

  // Step 2: Validate the token with username and password
  validateToken(
    token: string,
    username: string,
    password: string
  ): Observable<any> {
    return this.http.post(
      `${this.authUrl}/token/validate_with_login?api_key=${API_KEY}`,
      {
        username,
        password,
        request_token: token,
      },
      { headers: new HttpHeaders({ accept: 'application/json' }) }
    );
  }

  // Step 3: Create a session ID
  createSession(requestToken: string): Observable<any> {
    return this.http.post(
      `${this.authUrl}/session/new?api_key=${API_KEY}`,
      { request_token: requestToken },
      { headers: new HttpHeaders({ accept: 'application/json' }) }
    );
  }

  // Step 4:
  getAccountDetails(sessionId: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/account?api_key=${API_KEY}&session_id=${sessionId}`,
      { headers: new HttpHeaders({ accept: 'application/json' }) }
    );
  }

  // Delete session method
  deleteSession(sessionId: any): Observable<any> {
    const body = { session_id: sessionId };
    return this.http.delete(`${this.authUrl}/session?api_key=${API_KEY}`, {
      body,
      headers: new HttpHeaders({ accept: 'application/json' }),
    });
  }

  // Signal for storing favorites
  favorites = signal<any[]>([]);

  // Method to mark an item as favorite
  markAsFavorite(
    accountId: string,
    mediaType: string,
    mediaId: number,
    favorite: boolean
  ): Observable<any> {
    const url = `${
      this.apiUrl
    }/account/${accountId}/favorite?api_key=${API_KEY}&session_id=${this.sessionId()}`;
    const body = { media_type: mediaType, media_id: mediaId, favorite };
    return this.http.post(url, body, {
      headers: new HttpHeaders({ accept: 'application/json' }),
    });
  }

  // Method to update favorites state
  updateFavorites(newFavorites: any[]) {
    this.favorites.set(newFavorites);
  }

  // Utility to clear session and favorites on logout
  clearSession() {
    this.sessionId.set(null);
    this.accountDetails.set(null); // Reset account details
    this.favorites.set([]); // Clear favorites
  }

  getFavorites(sessionId: string, accountId: string): Observable<any> {
    const url = `${this.apiUrl}/account/${accountId}/favorite/movies?api_key=${API_KEY}&session_id=${sessionId}`;
    return this.http.get(url, {
      headers: new HttpHeaders({ accept: 'application/json' }),
    });
  }

  loadFavorites() {
    const sessionId = this.sessionId();
    const accountId = this.accountDetails()?.id;

    if (sessionId && accountId) {
      this.getFavorites(sessionId, accountId).subscribe({
        next: (favorites) => this.updateFavorites(favorites.results),
        error: (error) => console.error('Failed to load favorites:', error),
      });
    }
  }

  fetchNewToken() {
    this.getNewRequestToken().subscribe({
      next: (data) => {
        console.log('Request token:', data.request_token);
        const authUrl = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=YOUR_REDIRECT_URL`;
        window.open(authUrl, '_blank'); // Open the login page in a new tab
      },
      error: (error) => {
        console.error('Failed to fetch request token:', error);
      },
    });
  }
}
