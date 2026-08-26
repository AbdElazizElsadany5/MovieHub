 
 import { Injectable } from '@angular/core';
import { Movie } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly storageKey = 'moviehub-favorites';

  getFavorites(): Movie[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  isFavorite(movieId: string): boolean {
    return this.getFavorites().some(movie => movie._id === movieId);
  }

  toggleFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    const exists = favorites.some(item => item._id === movie._id);

    const updatedFavorites = exists
      ? favorites.filter(item => item._id !== movie._id)
      : [...favorites, movie];

    localStorage.setItem(this.storageKey, JSON.stringify(updatedFavorites));
  }

  removeFavorite(movieId: string): void {
    const updatedFavorites = this.getFavorites().filter(
      movie => movie._id !== movieId
    );

    localStorage.setItem(this.storageKey, JSON.stringify(updatedFavorites));
  }
}
