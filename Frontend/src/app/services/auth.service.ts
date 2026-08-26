 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { CurrentUser } from '../models/auth.model';

interface LoginResponse { token: string; data: CurrentUser; }
interface SignupResponse { success: boolean; data: CurrentUser; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'moviehub-token';
  private readonly userKey = 'moviehub-user';
  private readonly userSubject = new BehaviorSubject<CurrentUser | null>(this.readStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  get currentUser(): CurrentUser | null { return this.userSubject.value; }
  get token(): string | null { return localStorage.getItem(this.tokenKey); }
  get isLoggedIn(): boolean { return !!this.token; }
  get isAdmin(): boolean { return this.currentUser?.role === 'admin'; }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => this.setSession(response.token, response.data))
    );
  }

  signup(name: string, email: string, password: string, image = '') {
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, { name, email, password, image });
  }

  setSession(token: string, user: CurrentUser): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  private readStoredUser(): CurrentUser | null {
    const value = localStorage.getItem(this.userKey);
    return value ? JSON.parse(value) as CurrentUser : null;
  }
}
