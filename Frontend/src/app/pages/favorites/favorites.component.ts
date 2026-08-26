import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FavoriteService } from '../../services/favorite.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, MovieCardComponent],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {
  favorites: Movie[] = [];
  errorMessage = '';

  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Sign in to view your favorites.';
        this.cdr.markForCheck();
      }
    });
  }

  clearFavorites(): void {
    this.favorites.forEach((movie) => {
      this.favoriteService.removeFavorite(movie._id).subscribe({
        next: () => this.loadFavorites()
      });
    });
  }
}
