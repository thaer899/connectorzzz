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
import { SkillComponent } from './skills/skill/skill.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component'
import { ContactBoxComponent } from './shared/contact-box/contact-box.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PartnersComponent } from './partners/partners.component'

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
    ContactBoxComponent,
    AskComponent,
    SidenavComponent,
    SkillComponent,
    BlogComponent,
    BlogsComponent,
    PrivacyComponent,
    PartnersComponent],
  exports: [SidenavComponent]

}
)
export class ResumeModule { }
