import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FavoriteService } from '../../services/favorite.service';
import { User } from '../../models/auth.model';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  private userService = inject(UserService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  activeTab: 'info' | 'avatar' | 'password' | 'favorites' | 'danger' = 'info';

  user: User | null = null;
  favoriteMovies: Movie[] = [];
  defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=181825&color=ef4444&bold=true';

  // Update Profile form
  nameInput = '';
  emailInput = '';
  profileSuccessMsg = '';
  profileErrorMsg = '';
  isUpdatingProfile = false;

  // Avatar form
  imageUrlInput = '';
  avatarSuccessMsg = '';
  avatarErrorMsg = '';
  isUpdatingAvatar = false;

  // Password form
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordSuccessMsg = '';
  passwordErrorMsg = '';
  isChangingPassword = false;

  // Delete account modal
  showDeleteModal = false;
  isDeletingAccount = false;
  deleteErrorMsg = '';

  ngOnInit(): void {
    this.loadUserData();
    this.loadFavorites();
  }

  loadUserData(): void {
    this.user = this.authService.currentUser();
    if (this.user) {
      this.nameInput = this.user.name || '';
      this.emailInput = this.user.email || '';
      this.imageUrlInput = this.user.image || '';
    }

    this.authService.fetchCurrentUser().subscribe({
      next: (res: any) => {
        const u = res.data?.user || res.data;
        if (u) {
          this.user = u;
          if (!this.nameInput) this.nameInput = u.name || '';
          if (!this.emailInput) this.emailInput = u.email || '';
          if (!this.imageUrlInput) this.imageUrlInput = u.image || '';
        }
      }
    });
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (movies) => {
        this.favoriteMovies = movies;
      }
    });
  }

  onUpdateProfile(): void {
    if (!this.nameInput || !this.emailInput) {
      this.profileErrorMsg = 'Please fill out all required fields.';
      return;
    }
    this.profileErrorMsg = '';
    this.profileSuccessMsg = '';
    this.isUpdatingProfile = true;

    const updated = { ...this.user, name: this.nameInput, email: this.emailInput } as User;
    this.user = updated;
    this.authService.updateCurrentUser(updated);
    this.cdr.detectChanges();

    this.userService.updateProfile({ name: this.nameInput, email: this.emailInput }).subscribe({
      next: (res) => {
        this.isUpdatingProfile = false;
        this.profileSuccessMsg = 'Profile details updated successfully!';
        const serverUser = (res.data as any)?.user || res.data || updated;
        this.user = serverUser;
        this.authService.updateCurrentUser(serverUser);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUpdatingProfile = false;
        this.profileErrorMsg = err.error?.message || 'Failed to update profile details.';
        this.cdr.detectChanges();
      }
    });
  }

  onUpdateImage(): void {
    if (!this.imageUrlInput) {
      this.avatarErrorMsg = 'Please enter a valid image URL.';
      return;
    }
    this.avatarErrorMsg = '';
    this.avatarSuccessMsg = 'Profile picture updated successfully!';
    this.isUpdatingAvatar = false;

    const newUrl = this.imageUrlInput;
    const updated = { ...(this.user || {}), image: newUrl } as User;
    this.user = updated;
    this.authService.updateCurrentUser(updated);
    this.cdr.detectChanges();

    this.userService.updateImage(newUrl).subscribe({
      next: (res: any) => {
        const serverUser = res.data?.user || res.data || updated;
        this.user = serverUser;
        this.authService.updateCurrentUser(serverUser);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  onChangePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.passwordErrorMsg = 'Please fill in all password fields.';
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordErrorMsg = 'New password and confirm password do not match.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordErrorMsg = 'Password must be at least 6 characters long.';
      return;
    }

    this.passwordErrorMsg = '';
    this.passwordSuccessMsg = '';
    this.isChangingPassword = true;

    this.userService.changePassword({ password: this.currentPassword, newPassword: this.newPassword }).subscribe({
      next: (res) => {
        this.isChangingPassword = false;
        this.passwordSuccessMsg = res.message || 'Password changed successfully!';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: (err) => {
        this.isChangingPassword = false;
        this.passwordErrorMsg = err.error?.message || 'Incorrect current password or update failed.';
      }
    });
  }

  removeFavorite(movieId: string): void {
    this.favoriteService.removeFavorite(movieId).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(m => m._id !== movieId);
    });
  }

  onDeleteAccount(): void {
    this.isDeletingAccount = true;
    this.deleteErrorMsg = '';

    this.userService.deleteProfile().subscribe({
      next: () => {
        this.isDeletingAccount = false;
        this.showDeleteModal = false;
        this.authService.logout();
      },
      error: (err) => {
        this.isDeletingAccount = false;
        this.deleteErrorMsg = err.error?.message || 'Failed to delete profile.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
