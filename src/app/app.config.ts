import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './auth/AuthInterceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DashboardService } from './pages/dashboard/dashboard.service';
import { LoadingInterceptor } from './pages/loading/LoadingInterceptor';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor, LoadingInterceptor])),
    { provide: MatPaginatorIntl, useClass: DashboardService },
    provideAnimationsAsync(),
    providePrimeNG(),
  ],
};