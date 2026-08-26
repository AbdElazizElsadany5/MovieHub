import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CurrentUser } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  menuOpen = false;
  readonly defaultAvatar = 'https://i.pravatar.cc/120?img=12';

  readonly user$: Observable<CurrentUser | null>;

  constructor(private readonly authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
