import { finalize } from 'rxjs';
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from './LoadingService';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
