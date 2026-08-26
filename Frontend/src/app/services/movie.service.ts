
import { Injectable } from '@angular/core';

export interface Movie {
    _id: string;
    title: string;
    overview: string;
    poster: string;
    backdrop?: string;
    genres: string[];
    releaseYear: number;
    rating: number;
    cast?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private movies: Movie[] = [
        {
            _id: '1',
            title: 'Neon Abyss',
            releaseYear: 2024,
            rating: 8.4,
            genres: ['Sci-Fi', 'Thriller'],
            poster: 'https:images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80',
            backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
            overview: 'A futuristic mystery unfolds in a city where nothing is as it seems.',
            cast: ['Sara Kim', 'Dmitri Volkov', 'Lena Brandt']
        },
        {
            _id: '2',
            title: 'Crimson Meridian',
            releaseYear: 2024,
            rating: 7.9,
            genres: ['Action', 'Drama'],
            poster: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80',
            overview: 'An impossible mission tests loyalty, courage, and survival.'
        },
        {
            _id: '3',
            title: 'Ghost Protocol Zero',
            releaseYear: 2024,
            rating: 7.6,
            genres: ['Action', 'Thriller'],
            poster: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=700&q=80',
            overview: 'A secret agent races to stop a dangerous global threat.'
        },
        {
            _id: '4',
            title: 'Hollow Crown',
            releaseYear: 2024,
            rating: 8.3,
            genres: ['Crime', 'Drama'],
            poster: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=80',
            overview: 'A powerful family hides a dangerous secret.'
        },
        {
            _id: '5',
            title: 'Fracture Point',
            releaseYear: 2024,
            rating: 7.8,
            genres: ['Thriller', 'Crime'],
            poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
            overview: 'One decision can change everything.'
        },
        {
            _id: '6',
            title: 'Deadlight City',
            releaseYear: 2024,
            rating: 7.4,
            genres: ['Horror', 'Action'],
            poster: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80',
            overview: 'Darkness takes over a city after midnight.'
        },
        {
            _id: '7',
            title: 'The Last Meridian',
            releaseYear: 2023,
            rating: 8.7,
            genres: ['Drama', 'Adventure'],
            poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
            overview: 'A journey beyond the edge of the known world.'
        },
        {
            _id: '8',
            title: 'Orbital Decay',
            releaseYear: 2023,
            rating: 8.0,
            genres: ['Sci-Fi', 'Horror'],
            poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=700&q=80',
            backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
            overview: 'A reactor failure leaves a space station in a decaying orbit.',
            cast: ['Sara Kim', 'Dmitri Volkov', 'Lena Brandt']
        },
        {
            _id: '9',
            title: 'Still Waters',
            releaseYear: 2023,
            rating: 9.1,
            genres: ['Sci-Fi', 'Drama'],
            poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
            overview: 'A quiet world hides a life-changing discovery.'
        },
        {
            _id: '10',
            title: 'Ember & Ash',
            releaseYear: 2023,
            rating: 8.5,
            genres: ['Drama', 'Thriller'],
            poster: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80',
            overview: 'A gripping story of love, loss, and revenge.'
        },
        {
            _id: '11',
            title: 'Velvet Shadows',
            releaseYear: 2023,
            rating: 8.1,
            genres: ['Drama', 'Romance'],
            poster: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80',
            overview: 'A romance grows in the shadows of a dangerous city.'
        }
    ];

    getMovies(): Movie[] {
        return this.movies;
    }
}
