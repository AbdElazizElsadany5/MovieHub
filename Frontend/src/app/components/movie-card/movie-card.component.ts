import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html'
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;

  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.movie._id);
  }

  toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.movie).subscribe({
      next: () => this.cdr.markForCheck(),
      error: (error) => console.error('Could not update favorite:', error)
    });
  }
}
