import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './LoadingService';

@Component({
  standalone: true,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  imports: [CommonModule],
})
export class LoadingComponent {

  loading$: Observable<boolean>;

  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
