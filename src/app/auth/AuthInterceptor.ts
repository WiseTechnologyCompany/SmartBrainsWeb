import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
  const authToken = localStorage.getItem('access_token');

  if (authToken) {
    const authorizedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return next(authorizedRequest);
  }

  return next(request);
};