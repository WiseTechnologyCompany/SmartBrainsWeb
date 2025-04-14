import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();
  private requestCount = 0;

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loading.next(true);
    }
  }

  hide() {
    if (this.requestCount === 0) return;
    this.requestCount--;
    if (this.requestCount === 0) {
      this.loading.next(false);
    }
  }
}
