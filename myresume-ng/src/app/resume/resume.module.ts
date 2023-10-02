import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { EmploymentComponent } from './employment/employment.component'
import { SkillsComponent } from './skills/skills.component'
import { EducationComponent } from './education/education.component'
import { InterestsComponent } from './interests/interests.component'
import { LanguagesComponent } from './languages/languages.component'
import { ResumeRoutingModule } from './resume-routing.module'
import { HomeComponent } from './home/home.component';
import { AskComponent } from './ask/ask.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ResumeRoutingModule
  ],
  declarations: [
    EmploymentComponent,
    SkillsComponent,
    EducationComponent,
    InterestsComponent,
    LanguagesComponent,
    HomeComponent,

    AskComponent]
})
export class ResumeModule { }
