import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AutogenComponent } from './autogen/autogen.component';
import { AgentflowComponent } from './agentflow/agentflow.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { PlaygroundComponent } from './playground/playground.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'account-setup', component: AccountSetupComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { title: 'Admin' } },
  { path: 'autogen', component: AutogenComponent, canActivate: [AuthGuard], data: { title: 'Chat Autogen' } },
  { path: 'agentflow', component: AgentflowComponent, canActivate: [AuthGuard], data: { title: 'Agents Flow' } },
  { path: 'playground', component: PlaygroundComponent, canActivate: [AuthGuard], data: { title: 'Agents Playground' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
