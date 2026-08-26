import { Movie } from './movie.model';
import { User, CurrentUser } from './auth.model';

export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
}

export interface Review {
  _id: string;
  movieId?: string;
  movie?: string | Movie;
  user: string | User | CurrentUser | ReviewUser;
  rating: number;
  comment?: string;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface AddReviewRequest {
  movieId?: string;
  movie?: string;
  rating: number;
  comment?: string;
  review?: string;
}

export interface ReviewsResponse {
  status: string;
  results?: number;
  data: {
    reviews: Review[];
  };
}

export interface SingleReviewResponse {
  status: string;
  data: {
    review: Review;
  };
}
