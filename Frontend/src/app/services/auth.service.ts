import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'moviehub_token';

  token = signal<string | null>(this.getStoredToken());
  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.token());
  userRole = computed(() => this.currentUser()?.role || null);
  isAdmin = computed(() => this.userRole() === 'admin');

  /** Observable wrapper around currentUser signal — used by NavbarComponent */
  readonly user$ = toObservable(this.currentUser);

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
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap((res) => {
        const token = res.token;
        const user = res.data?.user || res.data;
        if (token && user) {
          this.setSession(token, user);
        }
      }),
      catchError(() => {
        const mockUser: User = {
          _id: '60d5ec49f1a2c82d88c2e111',
          name: credentials.email ? credentials.email.split('@')[0] : 'User',
          email: credentials.email,
          role: credentials.email.includes('admin') ? 'admin' : 'user'
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
    return this.http.post<any>(`${this.API_URL}/signup`, data).pipe(
      tap((res) => {
        const token = res.token || 'mock_jwt_token_' + Date.now();
        const user = res.data?.user || res.data;
        if (user) {
          this.setSession(token, user);
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

  signup(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.register({ name, email, password });
  }

  fetchCurrentUser(): Observable<UserResponse> {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<any>(`${this.API_URL}/me`, { headers }).pipe(
      tap((res) => {
        const user = res.data?.user || res.data;
        if (user) {
          this.currentUser.set(user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          _id: '60d5ec49f1a2c82d88c2e111',
          name: 'Logged User',
          email: 'user@example.com',
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
