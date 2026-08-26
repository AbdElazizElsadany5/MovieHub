import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
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

  isLoggedIn = computed(() => !!this.token() && !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  isAdmin = computed(() => this.userRole() === 'admin');

  readonly user$ = toObservable(this.currentUser);

  constructor() {
    if (this.token()) {
      this.fetchCurrentUser().subscribe({
        error: () => this.clearSession()
      });
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
      tap((res: any) => {
        const token = res.token;
        const user = res.data?.user || res.data;
        if (token && user) {
          this.setSession(token, user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, data).pipe(
      tap((res: any) => {
        const token = res.token;
        const user = res.data?.user || res.data;
        if (token && user) {
          this.setSession(token, user);
        }
      })
    );
  }

  signup(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.register({ name, email, password });
  }

  fetchCurrentUser(): Observable<UserResponse> {
    const token = this.getToken();
    if (!token) {
      this.clearSession();
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<UserResponse>(`${this.API_URL}/me`, { headers }).pipe(
      tap((res: any) => {
        const user = res.data?.user || res.data;
        if (user) {
          this.currentUser.set(user);
        }
      }),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token.set(token);
    this.currentUser.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }
}
