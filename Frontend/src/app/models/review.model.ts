import { Movie } from './movie.model';
import { CurrentUser } from './auth.model';

export interface Review {
  _id: string;
  user: string | CurrentUser;
  movie: string | Movie;
  rating: number;
  review: string;
  createdAt?: string;
  updatedAt?: string;
}
