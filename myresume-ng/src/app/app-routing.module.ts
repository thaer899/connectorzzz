import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FullComponent } from './layouts/full/full.component'

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', loadChildren: () => import('./resume/resume.module').then(m => m.ResumeModule) },
      { path: '', redirectTo: '/', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/' }
]
