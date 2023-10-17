import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
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
  public data = {};
  showContent: boolean = false;
  isAdmin: boolean = false;
  private user: any;
  public users: any;
  public fileName: string;
  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.user = this.authService.auth.currentUser;
    this.fileName = `${this.user.email}.json`;
    if (this.user) {
      this.showContent = true;
      this.isAdmin = this.user.email === environment.mainEmail;
      // Fetch data on component initialization
      console.log("Fetching data for user:", this.user.email);
      this.ngZone.run(() => {
        this.dataService.fetchDataForUser(this.fileName).subscribe(
          data => {
            if (data) {
              this.data = data;
              console.log("Data fetched:", this.data);
              this.cdRef.detectChanges();  // Trigger change detection
            }
          },
          error => {
            console.error("Error fetching data for user:", this.user.email, error);
            // Handle the error, e.g., show a notification to the user
          }
        );
      })
    }
    this.getUsers();
  }

  getUsers() {
    this.dataService.getListOfUsers().subscribe(
      users => {
        this.users = users;
        console.log("Users fetched:", this.users);
      },
      error => {
        console.error("Error fetching users:", error);
        // Handle the error, e.g., show a notification to the user
      }
    );
  }

  getUserDataByEmail(email: string) {
    console.log("Fetching data for user:", email);
    this.dataService.fetchDataForUser(email).subscribe(
      data => {
        if (data) {
          this.data = data;
          console.log("Data fetched:", this.data);
          this.fileName = email
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
    this.dataService.updateData(this.formData);
    if (this.visualComponent) {
      this.visualComponent.data = this.formData;
    }
  }

  // Upload the form data to Firebase Storage
  async upload() {
    const storage = getStorage();
    console.log("Uploading data to Firebase Storage...");

    // Debug: Print the user email and verify its value
    console.log(`User email: ${this.user.email}`);


    // Debug: Print the generated filename and verify its correctness
    console.log(`Generated fileName: ${this.fileName}`);

    const fileRef = ref(storage, this.fileName);
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

}




