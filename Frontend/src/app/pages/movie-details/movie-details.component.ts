import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './movie-details.component.html'
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);

  movie = signal<Movie | null>(null);
  similarMovies = signal<Movie[]>([]);
  reviews = signal<Review[]>([]);
  isLoading = signal(true);
  isTrailerOpen = signal(false);
  isFavorite = computed(() => {
    const m = this.movie();
    return m ? this.favoriteService.isFavorite(m._id) : false;
  });
  reviewSubmitting = signal(false);
  reviewError = signal<string | null>(null);
  reviewSuccess = signal(false);
  activeTab = signal<'overview' | 'cast' | 'reviews'>('overview');
  hoveredStar = signal(0);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());

  reviewForm: FormGroup = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  get selectedRating() {
    return this.reviewForm.get('rating')?.value || 0;
  }

  get f() {
    return this.reviewForm.controls;
  }

  get trailerEmbedUrl(): string {
    const url = this.movie()?.trailerUrl || '';
    const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    return '';
  }

  getReviewUserName(review: Review): string {
    if (typeof review.user === 'string') return 'User';
    return review.user?.name || 'Anonymous';
  }

  getStarArray(count: number): number[] {
    return Array(count).fill(0);
  }

  getRatingStars(rating: number): { full: number; empty: number } {
    const full = Math.round(rating / 2);
    return { full, empty: 5 - full };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovie(id);
      }
    });
  }

  loadMovie(id: string): void {
    this.isLoading.set(true);
    this.movieService.getMovieById(id).subscribe({
      next: (res) => {
        this.movie.set(res.data.movie);
        this.isLoading.set(false);
        this.loadSimilarMovies(id, res.data.movie.genres);
        this.loadReviews(id);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadSimilarMovies(currentId: string, genres: string[]): void {
    this.movieService.getSimilarMovies(currentId, genres).subscribe({
      next: (res) => {
        const list = res?.data?.movies || [];
        this.similarMovies.set(Array.isArray(list) ? list.slice(0, 4) : []);
      },
      error: () => this.similarMovies.set([])
    });
  }

  loadReviews(movieId: string): void {
    this.movieService.getReviews(movieId).subscribe({
      next: (res: any) => {
        const raw = res?.data;
        const list = Array.isArray(raw) ? raw : (raw?.reviews || []);
        this.reviews.set(list);
      },
      error: () => this.reviews.set([])
    });
  }

  get safeTrailerUrl(): SafeResourceUrl | null {
    const url = this.movie()?.trailerUrl || '';
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }

    if (videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    }
    return null;
  }

  openTrailer(): void {
    this.isTrailerOpen.set(true);
  }

  closeTrailer(): void {
    this.isTrailerOpen.set(false);
  }

  toggleFavorite(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const current = this.movie();
    if (current) {
      this.favoriteService.toggleFavorite(current).subscribe();
    }
  }

  setActiveTab(tab: 'overview' | 'cast' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  setHoveredStar(star: number): void {
    this.hoveredStar.set(star);
  }

  setRating(star: number): void {
    this.reviewForm.patchValue({ rating: star });
    this.hoveredStar.set(0);
  }

  getStarClass(star: number): string {
    const active = this.hoveredStar() > 0 ? this.hoveredStar() : this.selectedRating;
    return star <= active
      ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]'
      : 'text-neutral-600 hover:text-yellow-400/60';
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const movieId = this.movie()?._id;
    if (!movieId) return;

    this.reviewSubmitting.set(true);
    this.reviewError.set(null);

    this.movieService.addReview({
      movieId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment
    }).subscribe({
      next: (res) => {
        this.reviewSubmitting.set(false);
        this.reviewSuccess.set(true);
        this.loadReviews(movieId);
        this.reviewForm.reset({ rating: 0, comment: '' });
        setTimeout(() => this.reviewSuccess.set(false), 3000);
      },
      error: () => {
        this.reviewSubmitting.set(false);
        this.reviewError.set('Failed to submit review. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}