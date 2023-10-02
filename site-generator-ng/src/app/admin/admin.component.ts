import { Component, ChangeDetectorRef } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, createAjv, isControl, rankWith, scopeEndsWith } from '@jsonforms/core';
import { DataDisplayComponent } from '.././data.control';
import uischemaAsset from '../../assets/data/uischema.json';
import schemaAsset from '../../assets/data/schema.json';
import { DataService } from '.././services/data.service';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { AuthService } from '../services/auth.service'; // Update the path based on your project structure
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  // Form-related properties
  formData: any = {};
  renderers = [
    ...angularMaterialRenderers,
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
  ];
  uischema = uischemaAsset;
  public schema = schemaAsset;
  public data = {};
  showContent: boolean = false;
  private user: any;


  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = this.authService.auth.currentUser;
    if (this.user) {
      this.showContent = true;
      // Fetch data on component initialization
      console.log("Fetching data for user:", this.user.email);
      this.dataService.fetchDataForUser(this.user.email).subscribe(
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
    }
  }




  // Handle form data changes
  onDataChange(event) {
    this.formData = event;
    console.log("Form Data on Change:", this.formData);
    this.dataService.updateData(this.formData);
  }

  // Upload the form data to Firebase Storage
  async upload() {
    const storage = getStorage();
    console.log("Uploading data to Firebase Storage...");

    // Debug: Print the user email and verify its value
    console.log(`User email: ${this.user.email}`);

    const fileName = `${this.user.email}.json`;

    // Debug: Print the generated filename and verify its correctness
    console.log(`Generated fileName: ${fileName}`);

    const fileRef = ref(storage, fileName);
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
    anchor.setAttribute("download", "test.json");
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
}

