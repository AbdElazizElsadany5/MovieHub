import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Movie, MoviesListResponse, SingleMovieResponse } from '../models/movie.model';
import { ReviewsResponse, AddReviewRequest, SingleReviewResponse, Review } from '../models/review.model';

const MOCK_MOVIES: Movie[] = [
  {
    _id: '1',
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEW9W2QxacIpP9abj3B2Wjfe.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAiW5.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    releaseYear: 2010,
    duration: 148,
    rating: 8.8,
    numReviews: 2450,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy']
  },
  {
    _id: '2',
    title: 'Interstellar',
    overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fKSuV0Te.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    releaseYear: 2014,
    duration: 169,
    rating: 8.7,
    numReviews: 1980,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine']
  },
  {
    _id: '3',
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3VJ.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    genres: ['Action', 'Crime', 'Drama'],
    releaseYear: 2008,
    duration: 152,
    rating: 9.0,
    numReviews: 3200,
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman']
  },
  {
    _id: '4',
    title: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGvC2z1B2mw.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6K8Oi22WjEJW292yL2jPy9yR7.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    genres: ['Biography', 'Drama', 'History'],
    releaseYear: 2023,
    duration: 180,
    rating: 8.9,
    numReviews: 1420,
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.']
  }
];

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private readonly MOVIES_API = '/api/movies';
  private readonly REVIEWS_API = '/api/reviews';

  getMovies(): Observable<MoviesListResponse> {
    return this.http.get<MoviesListResponse>(this.MOVIES_API).pipe(
      catchError(() => {
        return of({
          status: 'success',
          results: MOCK_MOVIES.length,
          data: { movies: MOCK_MOVIES }
        });
      })
    );
  }

  getMovieById(id: string): Observable<SingleMovieResponse> {
    return this.http.get<SingleMovieResponse>(`${this.MOVIES_API}/${id}`).pipe(
      catchError(() => {
        const found = MOCK_MOVIES.find(m => m._id === id) || MOCK_MOVIES[0];
        return of({
          status: 'success',
          data: { movie: found }
        });
      })
    );
  }

  getSimilarMovies(currentMovieId: string, genres: string[] = []): Observable<MoviesListResponse> {
    return this.http.get<MoviesListResponse>(`${this.MOVIES_API}`).pipe(
      catchError(() => {
        const filtered = MOCK_MOVIES.filter(m => m._id !== currentMovieId);
        return of({
          status: 'success',
          results: filtered.length,
          data: { movies: filtered }
        });
      })
    );
  }

  getReviews(movieId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.REVIEWS_API}/${movieId}`).pipe(
      catchError(() => {
        const mockReviews: Review[] = [
          {
            _id: 'r1',
            movieId: movieId,
            movie: movieId,
            user: { _id: 'u1', name: 'Ahmed Ali' },
            rating: 5,
            comment: 'Masterpiece! Highly recommended for cinema fans.',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'r2',
            movieId: movieId,
            movie: movieId,
            user: { _id: 'u2', name: 'Sara Mohamed' },
            rating: 4,
            comment: 'Great acting and incredible visual effects.',
            createdAt: new Date().toISOString()
          }
        ];
        return of({
          status: 'success',
          data: { reviews: mockReviews }
        });
      })
    );
  }

  addReview(reviewData: AddReviewRequest): Observable<SingleReviewResponse> {
    return this.http.post<SingleReviewResponse>(this.REVIEWS_API, reviewData).pipe(
      catchError(() => {
        const newReview: Review = {
          _id: 'r_' + Date.now(),
          movieId: reviewData.movieId,
          movie: reviewData.movieId,
          user: { _id: 'dev_user_id', name: 'You (Dev User)' },
          rating: reviewData.rating,
          comment: reviewData.comment,
          createdAt: new Date().toISOString()
        };
        return of({
          status: 'success',
          data: { review: newReview }
        });
      })
    );
  }

  deleteReview(reviewId: string): Observable<{ status: string }> {
    return this.http.delete<{ status: string }>(`${this.REVIEWS_API}/${reviewId}`).pipe(
      catchError(() => of({ status: 'success' }))
    );
  }
}

