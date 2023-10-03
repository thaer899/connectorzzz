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
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FlexLayoutModule } from '@angular/flex-layout'

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ResumeRoutingModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule
  ],
  declarations: [
    EmploymentComponent,
    SkillsComponent,
    EducationComponent,
    InterestsComponent,
    LanguagesComponent,
    HomeComponent,
    AskComponent,
    SidenavComponent],
  exports: [SidenavComponent]

}
)
export class ResumeModule { }
