import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/Environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly access_token = 'access_token';
  private readonly URL = `${environment.API_URL}/auth/check`;

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(this.access_token);
  }

  checkToken(): Observable<boolean> {
    const access_token = this.getToken();
    
    if (!access_token) {
      return of(false);
    }
  
    return this.http.post<{ isValid: boolean }>(this.URL, { access_token }).pipe(
      map(response => response?.isValid ?? false),
      catchError(() => {
        return of(false);
      })
    );
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.checkToken();
  }

  logout(): void {
    localStorage.removeItem(this.access_token);
  }
}
