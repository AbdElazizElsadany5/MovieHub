import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center px-6 text-white text-center">
      <div class="w-16 h-16 rounded-full border-4 border-[#E50914] border-t-transparent animate-spin mb-6"></div>
      <h2 class="text-2xl font-bold font-display tracking-wide mb-2">Authenticating with Google...</h2>
      <p class="text-neutral-400 text-sm">Please wait while we finalize your sign-in to MovieHub.</p>
    </div>
  `
})
export class GoogleSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.authService.handleGoogleCallbackToken(token).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
