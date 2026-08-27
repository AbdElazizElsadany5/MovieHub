import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'moviehub_token';

  token = signal<string | null>(this.getStoredToken());
  currentUser = signal<User | null>(this.getStoredUser());

  isLoggedIn = computed(() => !!this.token() && !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  isAdmin = computed(() => this.userRole() === 'admin');

  readonly user$ = toObservable(this.currentUser);

  constructor() {
    if (this.token()) {
      this.fetchCurrentUser().subscribe({
        error: () => {}
      });
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem('moviehub_user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
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
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, data);
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
          localStorage.setItem('moviehub_user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      }),
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          this.clearSession();
        }
        return throwError(() => err);
      })
    );
  }

  updateCurrentUser(user: User): void {
    localStorage.setItem('moviehub_user', JSON.stringify(user));
    this.currentUser.set({ ...user });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem('moviehub_user', JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('moviehub_user');
    this.token.set(null);
    this.currentUser.set(null);
  }
}
