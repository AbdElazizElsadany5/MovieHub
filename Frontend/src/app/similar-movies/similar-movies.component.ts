import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-similar-movies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './similar-movies.component.html'
})
export class SimilarMoviesComponent implements OnInit, OnChanges {
  private movieService = inject(MovieService);

  @Input() currentMovieId = '';
  @Input() genres: string[] = [];

  similarMovies = signal<Movie[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchSimilar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentMovieId'] && !changes['currentMovieId'].firstChange) {
      this.fetchSimilar();
    }
  }

  private fetchSimilar(): void {
    this.isLoading.set(true);
    this.movieService.getSimilarMovies(this.currentMovieId, this.genres).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.similarMovies.set(res?.data?.movies || []);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
