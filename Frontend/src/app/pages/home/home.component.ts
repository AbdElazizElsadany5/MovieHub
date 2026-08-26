import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Movie, MovieService } from '../../services/movie.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, MovieCardComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    movies: Movie[] = [];
    featuredMovies: Movie[] = [];
    topRatedMovies: Movie[] = [];
    latestMovies: Movie[] = [];

    genres = [
        'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy',
        'Horror', 'Romance', 'Adventure', 'Crime', 'Animation'
    ];

    heroMovie!: Movie;

    constructor(private movieService: MovieService) { }

    ngOnInit(): void {
        this.movies = this.movieService.getMovies();
        this.heroMovie = this.movies.find(movie => movie.title === 'Orbital Decay') ?? this.movies[0];
        this.featuredMovies = this.movies.slice(0, 4);
        this.topRatedMovies = [...this.movies]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
        this.latestMovies = [...this.movies]
            .sort((a, b) => b.releaseYear - a.releaseYear)
            .slice(0, 6);
    }
}           },
error: (err) => console.error('Error fetching movies:', err)
        });
    }
}