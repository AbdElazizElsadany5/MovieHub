export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
}

export interface Review {
  _id: string;
  movieId?: string;
  movie?: string;
  user: ReviewUser | string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddReviewRequest {
  movieId: string;
  rating: number;
  comment: string;
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
