import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResumeComponent } from './resume.component';
import { EmploymentComponent } from './employment/employment.component';
import { SkillsComponent } from './skills/skills.component';
import { EducationComponent } from './education/education.component';
import { InterestsComponent } from './interests/interests.component';
import { LanguagesComponent } from './languages/languages.component';
import { HomeComponent } from './home/home.component';
import { AskComponent } from './ask/ask.component';
import { SkillComponent } from './skills/skill/skill.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ResumeComponent,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Home Page' } },
      { path: 'employment', component: EmploymentComponent, data: { title: 'Employment List' } },
      { path: 'skills', component: SkillsComponent, data: { title: 'Skill List' } },
      { path: 'skills/:id', component: SkillComponent, data: { title: 'Skill Details' } }, // New route for skill detail
      { path: 'education', component: EducationComponent, data: { title: 'Education List' } },
      { path: 'interests', component: InterestsComponent, data: { title: 'Interests List' } },
      { path: 'languages', component: LanguagesComponent, data: { title: 'Languages List' } },
      { path: 'blogs', component: BlogsComponent, data: { title: 'Blogs topics' } },
      { path: 'blogs/:id', component: BlogComponent, data: { title: 'Blog posts' } },
      { path: 'ask', component: AskComponent, data: { title: 'Ask me' } },

      // { path: '**', component: PageNotFoundComponent }, // handle no match routes
    ]
  },
  {
    path: ':email',
    component: ResumeComponent,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Home Page' } },
      { path: 'employment', component: EmploymentComponent, data: { title: 'Employment List' } },
      { path: 'skills', component: SkillsComponent, data: { title: 'Skill List' } },
      { path: 'skills/:id', component: SkillComponent, data: { title: 'Skill Details' } }, // New route for skill detail
      { path: 'education', component: EducationComponent, data: { title: 'Education List' } },
      { path: 'interests', component: InterestsComponent, data: { title: 'Interests List' } },
      { path: 'languages', component: LanguagesComponent, data: { title: 'Languages List' } },
      { path: 'blogs', component: BlogsComponent, data: { title: 'Blogs topics' } },
      { path: 'blogs/:id', component: BlogComponent, data: { title: 'Blog posts' } },
      { path: 'ask', component: AskComponent, data: { title: 'Ask me' } },

      // { path: '**', component: PageNotFoundComponent }, // handle no match routes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeRoutingModule { }
