import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Movie, MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [FormsModule, MovieCardComponent],
  templateUrl: './movies.component.html'
})
export class MoviesComponent implements OnInit {
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];

  searchText = '';
  selectedGenre = '';
  selectedSort = 'latest';
  currentPage = 1;
  moviesPerPage = 8;

  genres = [
    'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy',
    'Horror', 'Romance', 'Adventure', 'Crime', 'Animation'
  ];

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading movies:', error);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.selectedGenre = params['genre'] || '';
      this.applyFilters();
      this.cdr.markForCheck();
    });
  }

  applyFilters(): void {
    let result = [...this.allMovies];

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();

      result = result.filter(movie =>
        movie.title.toLowerCase().includes(search) ||
        movie.genres.some(genre =>
          genre.toLowerCase().includes(search)
        )
      );
    }

    if (this.selectedGenre) {
      result = result.filter(movie =>
        movie.genres.includes(this.selectedGenre)
      );
    }

    if (this.selectedSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (this.selectedSort === 'oldest') {
      result.sort((a, b) => a.releaseYear - b.releaseYear);
    } else {
      result.sort((a, b) => b.releaseYear - a.releaseYear);
    }

    this.filteredMovies = result;
    this.currentPage = 1;
  }

  get paginatedMovies(): Movie[] {
    const start = (this.currentPage - 1) * this.moviesPerPage;
    return this.filteredMovies.slice(start, start + this.moviesPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMovies.length / this.moviesPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
