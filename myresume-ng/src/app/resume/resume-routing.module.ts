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
import { PrivacyComponent } from './privacy/privacy.component';
import { PartnersComponent } from './partners/partners.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ResumeComponent,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Home' } },
      { path: 'employment', component: EmploymentComponent, data: { title: 'Employment' } },
      { path: 'skills', component: SkillsComponent, data: { title: 'Skills' } },
      { path: 'skills/:id', component: SkillComponent, data: { title: 'Skill Details' } }, // New route for skill detail
      { path: 'education', component: EducationComponent, data: { title: 'Education' } },
      { path: 'interests', component: InterestsComponent, data: { title: 'Interests' } },
      { path: 'languages', component: LanguagesComponent, data: { title: 'Languages' } },
      { path: 'blogs', component: BlogsComponent, data: { title: 'Blog' } },
      { path: 'blogs/:id', component: BlogComponent, data: { title: 'Blog posts' } },
      { path: 'ask', component: AskComponent, data: { title: 'Ask me' } },
      { path: 'partners', component: PartnersComponent, data: { title: 'Partners' } },
      { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy Statement page for ai.thaersaidi.net' } },

      // { path: '**', component: PageNotFoundComponent }, // handle no match routes
    ]
  },
  {
    path: 'p/:email',
    component: ResumeComponent,
    children: [
      { path: '', component: HomeComponent, data: { title: 'p/Home' } },
      { path: 'employment', component: EmploymentComponent, data: { title: 'p/Employment' } },
      { path: 'skills', component: SkillsComponent, data: { title: 'p/Skills' } },
      { path: 'skills/:id', component: SkillComponent, data: { title: 'p/Skill Details' } }, // New route for skill detail
      { path: 'education', component: EducationComponent, data: { title: 'p/Education' } },
      { path: 'interests', component: InterestsComponent, data: { title: 'p/Interests' } },
      { path: 'languages', component: LanguagesComponent, data: { title: 'p/Languages' } },
      { path: 'blogs', component: BlogsComponent, data: { title: 'p/Blog' } },
      { path: 'blogs/:id', component: BlogComponent, data: { title: 'p/Blog posts' } },
      { path: 'ask', component: AskComponent, data: { title: 'p/Ask me' } },

      // { path: '**', component: PageNotFoundComponent }, // handle no match routes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeRoutingModule { }
