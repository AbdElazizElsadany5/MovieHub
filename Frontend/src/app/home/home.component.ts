import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';
import { Review } from '../../models/review.model';
import { TrailerModalComponent } from '../../components/trailer-modal/trailer-modal.component';
import { SimilarMoviesComponent } from '../../components/similar-movies/similar-movies.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TrailerModalComponent,
    SimilarMoviesComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './movie-details.component.html'
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);

  movieId = signal<string>('');
  movie = signal<Movie | null>(null);
  reviews = signal<Review[]>([]);

  isLoadingMovie = signal<boolean>(true);
  isLoadingReviews = signal<boolean>(true);
  isSubmittingReview = signal<boolean>(false);

  movieError = signal<string | null>(null);
  reviewError = signal<string | null>(null);

  showTrailerModal = signal<boolean>(false);

  reviewForm: FormGroup = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(3)]]
  });

  selectedRating = signal<number>(5);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.movieId.set(id);
        this.loadMovieDetails(id);
        this.loadReviews(id);
      }
    });
  }

  loadMovieDetails(id: string): void {
    this.isLoadingMovie.set(true);
    this.movieError.set(null);

    this.movieService.getMovieById(id).subscribe({
      next: (res) => {
        this.isLoadingMovie.set(false);
        this.movie.set(res?.data?.movie || null);
      },
      error: (err) => {
        this.isLoadingMovie.set(false);
        this.movieError.set(err?.error?.message || 'Failed to load movie details.');
      }
    });
  }

  loadReviews(id: string): void {
    this.isLoadingReviews.set(true);
    this.movieService.getReviews(id).subscribe({
      next: (res) => {
        this.isLoadingReviews.set(false);
        this.reviews.set(res?.data?.reviews || []);
      },
      error: () => {
        this.isLoadingReviews.set(false);
      }
    });
  }

  setRating(stars: number): void {
    this.selectedRating.set(stars);
    this.reviewForm.patchValue({ rating: stars });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.isSubmittingReview.set(true);
    this.reviewError.set(null);

    const payload = {
      movieId: this.movieId(),
      rating: this.selectedRating(),
      comment: this.reviewForm.value.comment
    };

    this.movieService.addReview(payload).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.selectedRating.set(5);
        this.loadReviews(this.movieId());
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        this.reviewError.set(err?.error?.message || 'Failed to post review. Please try again.');
      }
    });
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.movieService.deleteReview(reviewId).subscribe({
        next: () => {
          this.loadReviews(this.movieId());
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete review.');
        }
      });
    }
  }

  canDeleteReview(review: Review): boolean {
    const current = this.authService.currentUser();
    if (!current) return false;
    if (current.role === 'admin') return true;

    const reviewUserId = typeof review.user === 'object' ? review.user._id : review.user;
    return current._id === reviewUserId;
  }

  openTrailer(): void {
    this.showTrailerModal.set(true);
  }

  closeTrailer(): void {
    this.showTrailerModal.set(false);
  }

  getReviewerName(review: Review): string {
    if (typeof review.user === 'object' && review.user?.name) {
      return review.user.name;
    }
    return 'Anonymous User';
  }

  formatDuration(minutes?: number): string {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  }
}
