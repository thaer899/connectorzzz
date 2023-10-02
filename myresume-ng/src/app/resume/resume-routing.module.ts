import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { ResumeComponent } from './resume.component'
import { EmploymentComponent } from './employment/employment.component'
import { SkillsComponent } from './skills/skills.component'
import { EducationComponent } from './education/education.component'
import { InterestsComponent } from './interests/interests.component'
import { LanguagesComponent } from './languages/languages.component'
import { HomeComponent } from './home/home.component'
import { AskComponent } from './ask/ask.component'

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employment',
        component: EmploymentComponent,
        data: { title: 'Employment List' }
      },
      {
        path: 'skills',
        component: SkillsComponent,
        data: { title: 'Skills List' }
      },
      {
        path: 'education',
        component: EducationComponent,
        data: { title: 'Education List' }
      },
      {
        path: 'interests',
        component: InterestsComponent,
        data: { title: 'Interests List' }
      },
      {
        path: 'languages',
        component: LanguagesComponent,
        data: { title: 'Languages List' }
      },
      {
        path: 'ask',
        component: AskComponent,
        data: { title: 'Ask me' }
      },
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Home Page' }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeRoutingModule { }
