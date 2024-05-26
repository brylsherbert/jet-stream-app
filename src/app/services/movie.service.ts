import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ApiResult, MovieResult } from './interfaces';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  constructor() {}

  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${BASE_URL}/movie/popular?page=${page}&api_key=${API_KEY}`
    );
  }

  getMovieDetails(id: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images`
    );
  }

  getSearchResponse(query: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      `${BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}`
    );
  }

  getPopularTvShows(): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}`
    );
  }

  getTvShowDetails(id: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}`
    );
  }
}
