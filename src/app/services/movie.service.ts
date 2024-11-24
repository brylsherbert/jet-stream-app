import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ApiResult, MovieResult, TvShowResult } from './interfaces';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  constructor() {}

  getMovies<T>(
    movieType: 'popular' | 'top_rated' | 'now_playing' | 'upcoming',
    page: number = 1
  ): Observable<ApiResult<T>> {
    // Construct URL
    const url = `${BASE_URL}/movie/${movieType}?page=${page}&api_key=${API_KEY}`;

    // Return observable
    return this.http.get<ApiResult<T>>(url);
  }

  getMovieDetails(id: string, page: number): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&page=${page}&append_to_response=videos,images,similar,recommendations,lists,credits`
    );
  }

  getSearchResponse<T>(page: number, query: string): Observable<ApiResult<T>> {
    return this.http.get<ApiResult<T>>(
      `${BASE_URL}/search/movie?query=${query}&page=${page}&include_adult=false&language=en-US&api_key=${API_KEY}`
    );
    // .pipe(delay(5000));
  }

  getPopularTvShows<T>(): Observable<ApiResult<T>> {
    return this.http.get<ApiResult<T>>(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}`
    );
  }

  getTvShowDetails(id: string, page: number): Observable<TvShowResult> {
    return this.http.get<TvShowResult>(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&page=${page}&append_to_response=videos,images,similar,recommendations,lists,account_states`
    );
  }

  getMovieGenres() {
    return this.http.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  }
}
