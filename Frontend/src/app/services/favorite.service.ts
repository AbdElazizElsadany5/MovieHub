import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap, switchMap, of } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieService } from './movie.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly apiUrl = `${environment.apiUrl}/favorites`;
  private favorites: Movie[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly movieService: MovieService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.getFavorites().subscribe({
          error: (err) => console.warn('Could not load favorites on login:', err)
        });
      } else {
        this.favorites = [];
      }
    });
  }

  getFavorites(): Observable<Movie[]> {
    if (!this.authService.getToken()) {
      this.favorites = [];
      return of([]);
    }

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
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}