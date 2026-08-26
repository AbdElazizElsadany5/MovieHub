import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Movie } from './movie.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly apiUrl = 'http://localhost:5000/api/favorites';
  private favorites: Movie[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getFavorites(): Observable<Movie[]> {
    return this.http.get<{ data: Array<{ movie: Movie }> }>(this.apiUrl, { headers: this.headers }).pipe(
      map((response) => response.data.map((favorite) => favorite.movie).filter(Boolean)),
      tap((movies) => this.favorites = movies)
    );
  }

  isFavorite(movieId: string): boolean {
    return this.favorites.some(movie => movie._id === movieId);
  }

  toggleFavorite(movie: Movie): Observable<void> {
    if (this.isFavorite(movie._id)) {
      return this.http.delete<void>(`${this.apiUrl}/${movie._id}`, { headers: this.headers }).pipe(
        tap(() => this.favorites = this.favorites.filter((item) => item._id !== movie._id))
      );
    }

    return this.http.post<void>(this.apiUrl, { movie: movie._id }, { headers: this.headers }).pipe(
      tap(() => this.favorites = [...this.favorites, movie])
    );
  }

  removeFavorite(movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${movieId}`, { headers: this.headers }).pipe(
      tap(() => this.favorites = this.favorites.filter((movie) => movie._id !== movieId))
    );
  }

  private get headers(): HttpHeaders {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
