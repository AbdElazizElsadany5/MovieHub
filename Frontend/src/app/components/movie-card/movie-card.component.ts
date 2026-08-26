import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-card.component.html'
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;

  private readonly favoriteService = inject(FavoriteService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.movie._id);
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.favoriteService.toggleFavorite(this.movie).subscribe({
      next: () => this.cdr.markForCheck(),
      error: (error) => console.error('Could not update favorite:', error)
    });
  }
}
