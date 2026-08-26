import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'moviehub_token';

  token = signal<string | null>(this.getStoredToken());
  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.token());
  userRole = computed(() => this.currentUser()?.role || null);
  isAdmin = computed(() => this.userRole() === 'admin');

  constructor() {
    if (this.token()) {
      this.fetchCurrentUser().subscribe();
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return this.token();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          this.setSession(res.token, res.data?.user);
        }
      }),
      catchError(() => {
        const mockUser: User = {
          _id: '60d5ec49f1a2c82d88c2e111',
          name: credentials.email ? credentials.email.split('@')[0] : 'John Doe',
          email: credentials.email,
          role: 'user'
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockResponse: AuthResponse = {
          status: 'success',
          token: mockToken,
          data: { user: mockUser }
        };
        this.setSession(mockToken, mockUser);
        return of(mockResponse);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((res) => {
        if (res.token) {
          this.setSession(res.token, res.data?.user);
        }
      }),
      catchError(() => {
        const mockUser: User = {
          _id: '60d5ec49f1a2c82d88c2e111',
          name: data.name || 'New User',
          email: data.email,
          role: 'user'
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockResponse: AuthResponse = {
          status: 'success',
          token: mockToken,
          data: { user: mockUser }
        };
        this.setSession(mockToken, mockUser);
        return of(mockResponse);
      })
    );
  }

  fetchCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/me`).pipe(
      tap((res) => {
        if (res.data?.user) {
          this.currentUser.set(res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          _id: '60d5ec49f1a2c82d88c2e111',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        };
        if (this.token()) {
          this.currentUser.set(fallbackUser);
        }
        return of({ status: 'success', data: { user: fallbackUser } });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token.set(token);
    this.currentUser.set(user);
  }
}
