import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  movies: Movie[] = [];
  featuredMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  latestMovies: Movie[] = [];


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
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
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

        this.cdr.markForCheck();
        this.startHeroSlider();
      },
      error: (error) => {
        console.error('ERROR FROM API:', error);
        this.cdr.markForCheck();
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