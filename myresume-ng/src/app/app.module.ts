import * as $ from 'jquery'
import { BrowserModule, provideClientHydration } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { FullComponent } from './layouts/full/full.component'
import { NavigationComponent } from './shared/header-navigation/navigation.component'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { NgScrollbarModule } from 'ngx-scrollbar'

import { Approutes } from './app-routing.module'
import { AppComponent } from './app.component'
import { SpinnerComponent } from './shared/spinner.component'
import { HttpClientModule } from '@angular/common/http'
import { ResumeComponent } from './resume/resume.component'
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ContactBoxComponent } from './shared/contact-box/contact-box.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResumeModule } from './resume/resume.module'
import { SidenavComponent } from './resume/shared/sidenav/sidenav.component'

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true,
//   wheelSpeed: 2,
//   wheelPropagation: true,
// };

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    NavigationComponent,
    ContactBoxComponent,
    ResumeComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(Approutes, { useHash: false, initialNavigation: 'enabledBlocking' }),
    NgScrollbarModule,
    ResumeModule
  ],
  exports: [
  ],
  providers: [
    provideClientHydration()],
  bootstrap: [AppComponent]
})
export class AppModule { }
