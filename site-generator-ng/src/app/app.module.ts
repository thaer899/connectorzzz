import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { AppComponent } from './app.component';
import { CustomAutocompleteControlRenderer } from './custom.autocomplete';
import { DataDisplayComponent } from './data.control';
import { LangComponent } from './lang.control';
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

@NgModule({
  declarations: [
    AppComponent,
    CustomAutocompleteControlRenderer,
    LangComponent,
    DataDisplayComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
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
    AppRoutingModule
  ],
  schemas: [],
  entryComponents: [CustomAutocompleteControlRenderer, LangComponent, DataDisplayComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
