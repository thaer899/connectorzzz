import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { FullComponent } from './layouts/full/full.component'

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: 'resume', loadChildren: () => import('./resume/resume.module').then(m => m.ResumeModule) },
      { path: '', redirectTo: '/resume', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/resume' }
]
