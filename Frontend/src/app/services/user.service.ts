import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/auth.model';

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface UsersListResponse {
  success: boolean;
  results: number;
  data: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/users';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('moviehub_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
  }

  // Profile operations for authenticated user
  updateProfile(data: { name: string; email: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/updateprofile`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateImage(image: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.API_URL}/updateimage`,
      { image },
      { headers: this.getAuthHeaders() }
    );
  }

  changePassword(data: { password: string; newPassword: string }): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.API_URL}/changepassword`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteProfile(): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/deleteprofile`, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin operations
  getAllUsers(): Observable<UsersListResponse> {
    return this.http.get<UsersListResponse>(`${this.API_URL}/getAllUsers`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/getUserById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUserByAdmin(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.API_URL}/deleteUserByAdmin/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateUserStatus(id: string, isActive: boolean): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.API_URL}/updateUserStatus/${id}`,
      { isActive },
      { headers: this.getAuthHeaders() }
    );
  }
}
