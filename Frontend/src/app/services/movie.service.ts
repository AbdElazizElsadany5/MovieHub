import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';

interface MoviesResponse {
  status: string;
  results: number;
  data: {
    movies: Movie[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = 'http://localhost:3000/api/movies?limit=100';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<MoviesResponse>(this.apiUrl)
      .pipe(
        map((response) => {
          const seen = new Set<string>();

          return response.data.movies.filter((movie) => {
            // This legacy record has invalid TMDB image URLs and is hidden until it is fixed in the database.
            if (movie.title === 'The Silence of the Lambs') return false;

            // Keep one record per movie; the API currently contains Inception twice.
            const key = `${movie.title.toLowerCase()}-${movie.releaseYear}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        })
      );
  }
}
