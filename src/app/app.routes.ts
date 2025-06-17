import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { AdicionarComponent } from './pages/adicionar-transacao/adicionar-transacao.component';
import { CodigoVerificacaoComponent } from './pages/codigo-verificacao/codigo-verificacao.component';
import { AtualizarSenhaComponent } from './pages/atualizar-senha/atualizar-senha.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
  { path: 'criar-conta', component: CriarContaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'adicionar', component: AdicionarComponent },
  { path: 'adicionar/:id', component: AdicionarComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'editar-usuario', component: EditarUsuarioComponent },
  { path: 'codigo-verificacao', component: CodigoVerificacaoComponent },
  { path: 'atualizar-senha', component: AtualizarSenhaComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: '**', component: NotFoundComponent }, 
];