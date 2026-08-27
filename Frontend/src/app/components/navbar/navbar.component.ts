import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  menuOpen = false;
  readonly defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=181825&color=ef4444&bold=true';

  private authService = inject(AuthService);
  readonly user$: Observable<User | null> = this.authService.user$;

  closeMenu(): void {
    this.menuOpen = false;
  }
}
