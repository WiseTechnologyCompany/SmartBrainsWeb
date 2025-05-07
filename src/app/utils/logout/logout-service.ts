import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LogoutService {
  constructor(private router: Router) {}

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}