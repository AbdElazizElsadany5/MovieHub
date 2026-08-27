import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoading = true;
  movies: Movie[] = [];
  featuredMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  latestMovies: Movie[] = [];
  isTrailerOpen = false;

  genres = [
    'Action',
    'Drama',
    'Sci-Fi',
    'Thriller',
    'Comedy',
    'Horror',
    'Romance',
    'Adventure',
    'Crime',
    'Animation'
  ];

  heroMovie: Movie | null = null;
  heroMovies: Movie[] = [];
  currentHeroIndex = 0;
  private sliderTimer?: ReturnType<typeof setInterval>;

  constructor(
    private readonly movieService: MovieService,
    private readonly cdr: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer
  ) { }

  get safeTrailerUrl(): SafeResourceUrl | null {
    const url = this.heroMovie?.trailerUrl || '';
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }

    if (videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
    }
    return null;
  }

  openTrailer(): void {
    this.isTrailerOpen = true;
    this.cdr.detectChanges();
  }

  closeTrailer(): void {
    this.isTrailerOpen = false;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        console.log('MOVIES FROM API:', movies);
        this.movies = movies;
        this.heroMovies = movies.slice(0, 5);
        this.heroMovie = this.heroMovies[0] ?? null;
        this.featuredMovies = movies.slice(0, 4);
        this.topRatedMovies = [...movies]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        this.latestMovies = [...movies]
          .sort((a, b) => b.releaseYear - a.releaseYear)
          .slice(0, 6);

        this.isLoading = false;
        this.cdr.detectChanges();
        this.startHeroSlider();
      },
      error: (error) => {
        console.error('ERROR FROM API:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopHeroSlider();
  }

  nextSlide(): void {
    if (!this.heroMovies.length) return;
    this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroMovies.length;
    this.heroMovie = this.heroMovies[this.currentHeroIndex];
    this.restartHeroSlider();
    this.cdr.markForCheck();
  }

  previousSlide(): void {
    if (!this.heroMovies.length) return;
    this.currentHeroIndex = (this.currentHeroIndex - 1 + this.heroMovies.length) % this.heroMovies.length;
    this.heroMovie = this.heroMovies[this.currentHeroIndex];
    this.restartHeroSlider();
    this.cdr.markForCheck();
  }

  goToSlide(index: number): void {
    this.currentHeroIndex = index;
    this.heroMovie = this.heroMovies[index] ?? null;
    this.restartHeroSlider();
    this.cdr.markForCheck();
  }

  private startHeroSlider(): void {
    this.stopHeroSlider();
    if (this.heroMovies.length > 1) {
      this.sliderTimer = setInterval(() => this.nextSlide(), 4000);
    }
  }

  private restartHeroSlider(): void {
    this.startHeroSlider();
  }

  private stopHeroSlider(): void {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
    }
  }
}