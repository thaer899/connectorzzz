import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { AppComponent } from './app.component';
import { CustomAutocompleteControlRenderer } from './controls/custom.autocomplete';
import { DataDisplayComponent } from './controls/data.control';
import { LangComponent } from './controls/lang.control';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminComponent } from './admin/admin.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JsonFormsState, Actions } from '@jsonforms/core';
import { BlogPostComponent } from './controls/blog-post.control';
import { ColorPickerComponent } from './controls/color-picker.control';
import { ColorPickerInputComponent } from './admin/color-picker/color-picker-input.component';
import { VisualComponent } from './controls/visual.control';
import { SiteVisualComponent } from './admin/site-visual/site-visual.component';
import { CustomTooltipComponent } from './admin/custom-tooltip/custom-tooltip.component';
import { AutogenComponent } from './autogen/autogen.component';
import { AutoScrollDirective } from './directives/auto-scroll.directive';
import { AgentflowComponent } from './agentflow/agentflow.component';
import { SidenavComponent } from './agentflow/sidenav/sidenav.component';
import { FlowchartComponent } from './agentflow/flowchart/flowchart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { GroupSidenavComponent } from './agentflow/group-sidenav/group-sidenav.component';
import { UsernameComponent } from './controls/username.control';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { MarkdownPipe } from './pipes/marked.pipe';
import { PlaygroundComponent } from './playground/playground.component';
import { PlaygroundSidenavComponent } from './playground/playground-sidenav/playground-sidenav.component';
import { PlaygroundGroupSidenavComponent } from './playground/playground-group-sidenav/playground-group-sidenav.component';
import { PlaygroundFlowchartComponent } from './playground/playground-flowchart/playground-flowchart.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CodeComponent } from './controls/code.control';

@NgModule({
  declarations: [
    AppComponent,
    CustomAutocompleteControlRenderer,
    LangComponent,
    DataDisplayComponent,
    BlogPostComponent,
    ColorPickerComponent,
    UsernameComponent,
    ColorPickerInputComponent,
    CustomTooltipComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    SiteVisualComponent,
    VisualComponent,
    AutogenComponent,
    AutoScrollDirective,
    PlaygroundComponent,
    PlaygroundSidenavComponent,
    PlaygroundGroupSidenavComponent,
    PlaygroundFlowchartComponent,
    AgentflowComponent,
    SidenavComponent,
    FlowchartComponent,
    GroupSidenavComponent,
    AccountSetupComponent,
    MarkdownPipe,
    CodeComponent
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    AppRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
    MonacoEditorModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CustomAutocompleteControlRenderer, LangComponent, DataDisplayComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
