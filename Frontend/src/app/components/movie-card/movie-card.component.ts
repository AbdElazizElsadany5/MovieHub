 import { Component, Input } from '@angular/core';
import { Movie } from '../../services/movie.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html'
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;

  constructor(private favoriteService: FavoriteService) {}

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.movie._id);
  }

  toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.movie);
  }
}
 
