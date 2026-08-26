import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap, switchMap } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieService } from './movie.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly apiUrl = 'http://localhost:3000/api/favorites';
  private favorites: Movie[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly movieService: MovieService
  ) {}

  getFavorites(): Observable<Movie[]> {
    return this.movieService.getMovies().pipe(
      switchMap((allMovies) => {
        return this.http.get<{ data: Array<{ movie: string | Movie }> }>(this.apiUrl, { headers: this.headers }).pipe(
          map((response) => {
            const favoriteIds = response.data.map(fav => typeof fav.movie === 'string' ? fav.movie : fav.movie?._id).filter(Boolean);
            const favMovies = allMovies.filter(movie => favoriteIds.includes(movie._id));
            return favMovies;
          }),
          tap((movies) => this.favorites = movies)
        );
      })
    );
  }

  isFavorite(movieId: string): boolean {
    return this.favorites.some(movie => movie._id === movieId);
  }

  toggleFavorite(movie: Movie): Observable<void> {
    if (this.isFavorite(movie._id)) {
      return this.http.delete<void>(`${this.apiUrl}/${movie._id}`, {
        headers: this.headers,
        body: { movie: movie._id }
      }).pipe(
        tap(() => this.favorites = this.favorites.filter((item) => item._id !== movie._id))
      );
    }

    return this.http.post<void>(this.apiUrl, { movie: movie._id }, { headers: this.headers }).pipe(
      tap(() => this.favorites = [...this.favorites, movie])
    );
  }

  removeFavorite(movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${movieId}`, {
      headers: this.headers,
      body: { movie: movieId }
    }).pipe(
      tap(() => this.favorites = this.favorites.filter((movie) => movie._id !== movieId))
    );
  }

  private get headers(): HttpHeaders {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}