import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AutogenComponent } from './autogen/autogen.component';
import { AgentflowComponent } from './agentflow/agentflow.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { title: 'Admin' } },
  { path: 'autogen', component: AutogenComponent, canActivate: [AuthGuard], data: { title: 'Chat Autogen' } },
  { path: 'agentflow', component: AgentflowComponent, canActivate: [AuthGuard], data: { title: 'Agents Flow' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
