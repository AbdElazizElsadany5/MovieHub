import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Movie, SingleMovieResponse, MoviesListResponse } from '../models/movie.model';
import { ReviewsResponse, SingleReviewResponse, AddReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly BASE_URL = 'http://localhost:3000/api';
  private apiUrl = `${this.BASE_URL}/movies?limit=100`;

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<MoviesListResponse>(this.apiUrl)
      .pipe(
        map((response) => {
          const seen = new Set<string>();

          return response.data.movies.filter((movie) => {
            if (movie.title === 'The Silence of the Lambs') return false;

            const key = `${movie.title.toLowerCase()}-${movie.releaseYear}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }),
        catchError(() => of([]))
      );
  }

  getMovieById(id: string): Observable<SingleMovieResponse> {
    return this.http.get<SingleMovieResponse>(`${this.BASE_URL}/movies/${id}`).pipe(
      catchError(() => of({ status: 'error', data: { movie: null as unknown as Movie } }))
    );
  }

  getSimilarMovies(currentMovieId: string, genres: string[] = []): Observable<{ data: { movies: Movie[] } }> {
    return this.getMovies().pipe(
      map(movies => {
        const filtered = movies
          .filter(m => m._id !== currentMovieId)
          .filter(m => genres.length === 0 || (m.genres && m.genres.some(g => genres.includes(g))))
          .slice(0, 4);
        return { data: { movies: filtered } };
      })
    );
  }

  getReviews(movieId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.BASE_URL}/reviews/${movieId}`).pipe(
      catchError(() => of({ status: 'success', data: { reviews: [] } }))
    );
  }

  addReview(payload: AddReviewRequest): Observable<SingleReviewResponse> {
    const token = localStorage.getItem('moviehub_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    const body = {
      movie: payload.movieId || payload.movie,
      rating: payload.rating,
      review: payload.comment || payload.review
    };
    return this.http.post<SingleReviewResponse>(`${this.BASE_URL}/reviews`, body, { headers });
  }

  addMovie(movieData: Partial<Movie>): Observable<SingleMovieResponse> {
    const token = localStorage.getItem('moviehub_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
    return this.http.post<SingleMovieResponse>(`${this.BASE_URL}/movies`, movieData, { headers });
  }

  updateMovie(id: string, movieData: Partial<Movie>): Observable<SingleMovieResponse> {
    const token = localStorage.getItem('moviehub_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
    return this.http.put<SingleMovieResponse>(`${this.BASE_URL}/movies/${id}`, movieData, { headers });
  }

  deleteMovie(id: string): Observable<any> {
    const token = localStorage.getItem('moviehub_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    return this.http.delete(`${this.BASE_URL}/movies/${id}`, { headers });
  }
}
