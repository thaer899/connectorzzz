import { Component, ChangeDetectorRef, ViewChild, SimpleChanges, Inject, Renderer2 } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, createAjv, isControl, rankWith, scopeEndsWith } from '@jsonforms/core';
import { DataDisplayComponent } from '../controls/data.control';
import uischemaAsset from '../../assets/data/uischema.json';
import schemaAsset from '../../assets/data/schema.json';
import { DataService } from '.././services/data.service';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { AuthService } from '../services/auth.service'; // Update the path based on your project structure
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { BlogPostComponent } from '../controls/blog-post.control';
import { ColorPickerComponent } from '../controls/color-picker.control';
import { NgZone } from '@angular/core';
import { VisualComponent } from '../controls/visual.control';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UsernameComponent } from '../controls/username.control';
import { DOCUMENT } from '@angular/common';



interface ParameterDetail {
  type: string;
  description: string;
}

interface FunctionData {
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  return_type: string;
  return_description: string;
}

interface OriginalFunctionData {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; }>;
    required?: string[];
  };
  return: {
    type: string;
    description: string;
  };
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  @ViewChild(VisualComponent) visualComponent: VisualComponent;


  formData: any = {};
  renderers = [
    ...angularMaterialRenderers,
    {
      renderer: BlogPostComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          scopeEndsWith('___blog')
        )
      )
    },
    {
      renderer: ColorPickerComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          scopeEndsWith('___color')
        )
      )
    },
    {
      renderer: UsernameComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          scopeEndsWith('___username')
        )
      )
    },
    {
      renderer: VisualComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          scopeEndsWith('___visual')
        )
      )
    },
    {
      renderer: DataDisplayComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          scopeEndsWith('___data')
        )
      )
    }
    // ,
    // {
    //   renderer: FileUploadComponent,
    //   tester: rankWith(3, and(isControl, scopeEndsWith('#/properties/resume/picture')))
    // }
  ];
  uischema = uischemaAsset;
  public schema = schemaAsset;
  public data: any = {};
  showContent: boolean = false;
  isAdmin: boolean = false;
  public user: any;
  public users: any;
  public username: string;
  public fileName: string;
  currentTheme = 'dark';
  constructor(
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private titleService: Title) {
    this.renderer.addClass(document.body, 'dark-theme');

  }


  ngOnInit() {

    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(`${environment.title} - ${data.title}`);
      }
    });

    this.user = this.authService.auth.currentUser;

    if (this.user) {
      if (this.user.email == environment.mainEmail) {
        this.isAdmin = true;
      }

      // Fetch data for user
      this.ngZone.run(() => {
        this.dataService.fetchDataForUser(this.user.email).subscribe(
          data => {
            if (data) {
              this.data = data;
              // Fetch functions and update this.data.functions
              this.dataService.fetchFunctions().subscribe(
                functionsData => {
                  this.data.functions = this.transformFunctionData(functionsData);
                  console.log("Functions:", this.data);
                  this.cdRef.detectChanges();  // Trigger change detection
                },
                error => console.error("Error fetching functions:", error)
              );
            }
          },
          error => {
            console.error("Error fetching data for user:", this.user.email, error);
          }
        );
      });
    }

    this.fileName = `${this.user.email}.json`;
    this.getUsers();
    this.showContent = true;
  }


  async getUsers() {
    try {
      const users = await this.dataService.fetchUsers().toPromise();
      this.users = users;
      this.checkInactiveUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  checkInactiveUsers() {
    const hasInactiveCurrentUser = this.users.some(user => !user.active && user.email === this.user.email);
    if (hasInactiveCurrentUser) {
      this.showContent = false;

      this.snackBar.open('Inactive current user found!', 'Close', {
        duration: 2000, // The snackbar will auto-dismiss after 2 seconds
      });
    }
  }


  getUserDataByEmail(email: string) {
    this.dataService.fetchDataForUser(email).subscribe(
      data => {
        if (data) {
          this.data = data;
          this.fileName = email + '.json'
          this.cdRef.detectChanges();
        }
      },
      error => {
        console.error("Error fetching data for user:", email, error);
        // Handle the error, e.g., show a notification to the user
      }
    );
  }


  // Handle form data changes
  onDataChange(event) {
    this.formData = event;
    if (this.visualComponent) {
      this.visualComponent.data = this.formData;
    }
  }

  // Upload the form data to Firebase Storage
  async upload() {
    const storage = getStorage();
    console.log("Uploading data to Firebase Storage...");
    const fileRef = ref(storage, `profiles/${this.user.email}.json`);
    const dataString = JSON.stringify(this.formData);
    console.log("Data to be uploaded:", this.formData);
    try {
      await uploadString(fileRef, dataString);
      console.log('Data uploaded to Firebase Storage');
      this.snackBar.open('Data uploaded successfully!', 'Close', {
        duration: 2000,  // The snackbar will auto-dismiss after 2 seconds
      });
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }


  async save_functions() {
    const storage = getStorage();
    console.log("Uploading data to Firebase Storage...");
    const fileRef = ref(storage, `functions.json`);
    const functionsData = this.revertFunctionData(this.formData.functions);
    const dataString = JSON.stringify(functionsData);
    console.log("Data to be uploaded:", functionsData);
    try {
      await uploadString(fileRef, dataString);
      console.log('Data uploaded to Firebase Storage');
      this.snackBar.open('Data uploaded successfully!', 'Close', {
        duration: 2000,  // The snackbar will auto-dismiss after 2 seconds
      });
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }

  // Download the form data as a JSON file
  download() {
    const jsonString = JSON.stringify(this.formData);
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    const anchor = document.createElement("a");
    anchor.setAttribute("download", this.fileName);
    anchor.setAttribute("href", dataUrl);
    anchor.click();
    this.snackBar.open('Preparing data to be downloaded...!', 'Close', {
      duration: 2000,  // The snackbar will auto-dismiss after 2 seconds
    });
  }

  logout() {
    this.authService.logout();
    console.log('Logout successful');
    this.snackBar.open('Logout successful!', 'Close', {
      duration: 2000,  // The snackbar will auto-dismiss after 2 seconds
    });
  }
  // Utility function to check if a string is valid JSON
  isValidJson(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  onFileUploaded(fileContent: string) {
    this.formData.picture = fileContent;
  }

  transformFunctionData(functionsData: OriginalFunctionData[]) {
    return functionsData.map((func) => {
      let transformedFunc = {
        name: func.name,
        description: func.description,
        parameters: [],
        return_type: func.return.type,
        return_description: func.return.description,
      };

      if (func.parameters && 'properties' in func.parameters) {
        Object.entries(func.parameters.properties).forEach(([paramName, paramDetails]) => {
          let paramObj = {
            name: paramName,
            type: paramDetails.type,
            description: paramDetails.description,
            required: func.parameters.required?.includes(paramName),
          };
          transformedFunc.parameters.push(paramObj);
        });
      }

      return transformedFunc;
    });
  }


  revertFunctionData(transformedData: FunctionData[]): OriginalFunctionData[] {
    return transformedData.map(func => {
      let originalFunc = {
        name: func.name,
        description: func.description,
        parameters: {
          type: "object",
          properties: {},
          required: []
        },
        return: {
          type: func.return_type,
          description: func.return_description
        }
      };

      // Iterate over parameters array and populate properties and required
      func.parameters.forEach(param => {
        originalFunc.parameters.properties[param.name] = {
          type: param.type,
          description: param.description
        };
        // Assuming every parameter is required (adjust logic if this assumption is incorrect)
        originalFunc.parameters.required.push(param.name);
      });

      return originalFunc;
    });
  }

  toggleTheme(): void {
    this.renderer.removeClass(document.body, this.currentTheme + '-theme');
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.addClass(document.body, this.currentTheme + '-theme');
    console.log("Theme changed to:", this.currentTheme);
  }

  ngOnDestroy() {
    // Remove class from body when the component is destroyed
    this.renderer.removeClass(document.body, 'dark-theme');
  }
}




