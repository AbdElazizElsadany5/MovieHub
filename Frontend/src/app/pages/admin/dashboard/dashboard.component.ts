import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MovieService } from '../../../services/movie.service';
import { AuthService } from '../../../services/auth.service';
import { User, AdminUser } from '../../../models/auth.model';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  private movieService = inject(MovieService);
  private authService = inject(AuthService);

  activeTab: 'dashboard' | 'users' | 'movies' = 'dashboard';

  get adminName(): string {
    return this.authService.currentUser()?.name || 'Admin';
  }

  users: any[] = [];
  movies: Movie[] = [];

  isLoadingUsers = true;
  isLoadingMovies = true;

  userSearchTerm = '';
  movieSearchTerm = '';

  // Pagination
  userPage = 1;
  userPageSize = 10;
  moviePage = 1;
  moviePageSize = 10;

  // Single User Details Modal
  selectedUser: any = null;
  showUserDetailModal = false;

  // Delete User Modal
  userToDelete: any = null;
  showDeleteUserModal = false;

  // Movie Form (Add / Edit)
  showMovieFormModal = false;
  isEditMode = false;
  selectedMovieId: string | null = null;

  movieForm = {
    title: '',
    overview: '',
    poster: '',
    backdrop: '',
    trailerUrl: '',
    genresInput: '',
    releaseYear: new Date().getFullYear(),
    rating: 8.0,
    duration: 120
  };

  // Delete Movie Modal
  movieToDelete: Movie | null = null;
  showDeleteMovieModal = false;

  // Notifications
  successMsg = '';
  errorMsg = '';
  isSubmitting = false;

  defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=181825&color=ef4444&bold=true';

  ngOnInit(): void {
    this.loadUsers();
    this.loadMovies();
  }

  // --- DATA LOADING ---
  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.isLoadingUsers = false;
        this.users = res.data || res.users || [];
      },
      error: () => {
        this.isLoadingUsers = false;
        this.users = [];
      }
    });
  }

  loadMovies(): void {
    this.isLoadingMovies = true;
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.isLoadingMovies = false;
        this.movies = movies || [];
      },
      error: () => {
        this.isLoadingMovies = false;
        this.movies = [];
      }
    });
  }

  // --- STATS COMPUTATIONS ---
  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsersCount(): number {
    return this.users.filter((u) => u.isActive !== false).length;
  }

  get adminUsersCount(): number {
    return this.users.filter((u) => u.role === 'admin').length;
  }

  get totalMovies(): number {
    return this.movies.length;
  }

  get averageRating(): string {
    if (!this.movies.length) return '0.0';
    const sum = this.movies.reduce((acc, m) => acc + (m.rating || 0), 0);
    return (sum / this.movies.length).toFixed(1);
  }

  // --- SEARCH FILTERS & PAGINATION ---
  get filteredUsers(): any[] {
    if (!this.userSearchTerm.trim()) return this.users;
    const term = this.userSearchTerm.toLowerCase();
    return this.users.filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term)
    );
  }

  get paginatedUsers(): any[] {
    const start = (this.userPage - 1) * this.userPageSize;
    return this.filteredUsers.slice(start, start + this.userPageSize);
  }

  get totalUserPages(): number {
    return Math.ceil(this.filteredUsers.length / this.userPageSize) || 1;
  }

  get filteredMovies(): Movie[] {
    if (!this.movieSearchTerm.trim()) return this.movies;
    const term = this.movieSearchTerm.toLowerCase();
    return this.movies.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        (m.genres && m.genres.some((g) => g.toLowerCase().includes(term))) ||
        (m.releaseYear && m.releaseYear.toString().includes(term))
    );
  }

  get paginatedMovies(): Movie[] {
    const start = (this.moviePage - 1) * this.moviePageSize;
    return this.filteredMovies.slice(start, start + this.moviePageSize);
  }

  get totalMoviePages(): number {
    return Math.ceil(this.filteredMovies.length / this.moviePageSize) || 1;
  }

  toggleUserStatus(user: any): void {
    const newStatus = !(user.isActive !== false);
    user.isActive = newStatus;
    this.showToast(`User status updated to ${newStatus ? 'Active' : 'Disabled'}.`);

    this.userService.updateUserStatus(user._id, newStatus).subscribe({
      next: () => {},
      error: () => {
        user.isActive = !newStatus;
        this.showToast('Failed to update user status.', true);
      }
    });
  }

  viewUserDetails(user: any): void {
    this.userService.getUserById(user._id).subscribe({
      next: (res) => {
        this.selectedUser = res.data || user;
        this.showUserDetailModal = true;
      },
      error: () => {
        this.selectedUser = user;
        this.showUserDetailModal = true;
      }
    });
  }

  openUserDetail(user: any): void {
    this.selectedUser = user;
    this.showUserDetailModal = true;
  }

  promptDeleteUser(user: any): void {
    const currentAdminId = this.authService.currentUser()?._id;
    if (user._id === currentAdminId) {
      this.showToast('You cannot delete your own active admin account!', true);
      return;
    }
    this.userToDelete = user;
    this.showDeleteUserModal = true;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;
    const targetId = this.userToDelete._id;

    // Instantly remove user from list and close modal
    this.users = this.users.filter((u) => u._id !== targetId);
    this.showDeleteUserModal = false;
    this.showToast('User deleted successfully.');

    this.userService.deleteUserByAdmin(targetId).subscribe({
      next: () => {
        this.userToDelete = null;
      },
      error: () => {
        this.userToDelete = null;
      }
    });
  }

  // --- MOVIE MANAGEMENT ACTIONS ---
  openAddMovieModal(): void {
    this.isEditMode = false;
    this.selectedMovieId = null;
    this.movieForm = {
      title: '',
      overview: '',
      poster: '',
      backdrop: '',
      trailerUrl: '',
      genresInput: 'Action, Drama',
      releaseYear: new Date().getFullYear(),
      rating: 8.0,
      duration: 120
    };
    this.showMovieFormModal = true;
  }

  openEditMovieModal(movie: Movie): void {
    this.isEditMode = true;
    this.selectedMovieId = movie._id;
    this.movieForm = {
      title: movie.title || '',
      overview: movie.overview || '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      trailerUrl: movie.trailerUrl || '',
      genresInput: movie.genres ? movie.genres.join(', ') : '',
      releaseYear: movie.releaseYear || 2024,
      rating: movie.rating || 8.0,
      duration: movie.duration || 120
    };
    this.showMovieFormModal = true;
  }

  saveMovie(): void {
    if (!this.movieForm.title || !this.movieForm.poster || !this.movieForm.overview) {
      this.showToast('Please fill in required fields (Title, Poster, Overview).', true);
      return;
    }

    const genres = this.movieForm.genresInput
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const payload: Partial<Movie> = {
      title: this.movieForm.title,
      overview: this.movieForm.overview,
      poster: this.movieForm.poster,
      backdrop: this.movieForm.backdrop,
      trailerUrl: this.movieForm.trailerUrl,
      genres,
      releaseYear: Number(this.movieForm.releaseYear),
      rating: Number(this.movieForm.rating),
      duration: Number(this.movieForm.duration)
    };

    if (this.isEditMode && this.selectedMovieId) {
      const targetId = this.selectedMovieId;
      const idx = this.movies.findIndex((m) => m._id === targetId);
      if (idx !== -1) {
        this.movies[idx] = { ...this.movies[idx], ...payload };
      }
      this.showMovieFormModal = false;
      this.showToast('Movie updated successfully.');

      this.movieService.updateMovie(targetId, payload).subscribe({
        next: () => {},
        error: () => {}
      });
    } else {
      const tempMovie: Movie = {
        _id: 'temp_' + Date.now(),
        ...payload
      } as Movie;

      this.movies.unshift(tempMovie);
      this.showMovieFormModal = false;
      this.showToast('New movie added successfully.');

      this.movieService.addMovie(payload).subscribe({
        next: (res: any) => {
          const added = res.data?.movie || res.data;
          if (added && added._id) {
            const idx = this.movies.findIndex((m) => m._id === tempMovie._id);
            if (idx !== -1) this.movies[idx] = added;
          }
        },
        error: () => {}
      });
    }
  }

  promptDeleteMovie(movie: Movie): void {
    this.movieToDelete = movie;
    this.showDeleteMovieModal = true;
  }

  deleteMovie(): void {
    if (!this.movieToDelete) return;
    const targetId = this.movieToDelete._id;

    // Instantly remove movie from list and close modal
    this.movies = this.movies.filter((m) => m._id !== targetId);
    this.showDeleteMovieModal = false;
    this.showToast('Movie deleted successfully.');

    this.movieService.deleteMovie(targetId).subscribe({
      next: () => {
        this.movieToDelete = null;
      },
      error: () => {
        this.movieToDelete = null;
      }
    });
  }

  // --- UTILS ---
  private showToast(msg: string, isError = false): void {
    if (isError) {
      this.errorMsg = msg;
      setTimeout(() => (this.errorMsg = ''), 4000);
    } else {
      this.successMsg = msg;
      setTimeout(() => (this.successMsg = ''), 4000);
    }
  }
}
