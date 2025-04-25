import { Routes } from '@angular/router';
import { AuthGuard } from './auth/AuthGuard';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdicionarComponent } from './pages/adicionar-transacao/adicionar-transacao.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
  { path: 'criar-conta', component: CriarContaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'adicionar', component: AdicionarComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', component: NotFoundComponent }, 
];

