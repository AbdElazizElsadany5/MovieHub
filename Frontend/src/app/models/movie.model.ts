export interface Movie {
  _id: string;
  title: string;
  overview: string;
  poster: string;
  backdrop?: string;
  trailerUrl?: string;
  genres: string[];
  releaseYear: number;
  duration?: number;
  rating: number;
  numReviews?: number;
  cast?: string[];
  createdBy?: string | { name: string };
}
