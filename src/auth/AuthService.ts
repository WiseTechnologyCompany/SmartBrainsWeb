import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/Environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly access_token = 'access_token';
  private readonly URL = `${environment.API_URL}/auth/check`;

  constructor(private router: Router, private http: HttpClient) {}

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.access_token);
    }
    return null;
  }

  checkToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false); 
    }

    return this.http.post<{ valid: boolean }>(this.URL, { token }).pipe(
      map(response => response.valid), 
      catchError(() => of(false)) 
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.checkToken();
  }

  logout(): void {
    localStorage.removeItem(this.access_token);
    this.router.navigate(['/login']); 
  }
}
