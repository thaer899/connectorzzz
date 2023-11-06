import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';
import { AuthService } from '../services/auth.service';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-data-component',
  template: `
  <div style="width: 100%;" *ngIf="users">
  <div *ngIf="!isUserActive" style="padding: 10px;margin-bottom:20px; background-color: #caca3b; color: black; text-align: center;">
    Warning: The profile is not active!
  </div>
  <mat-form-field  style="width: 90%;">
  <mat-label>Username</mat-label>
    <input matInput [(ngModel)]="username">
  </mat-form-field>
  <mat-icon style="width: 10%;text-align: center;color:red"(click)="upload()" matTooltip="Activate" *ngIf="!isUserActive">warning</mat-icon>
  <mat-icon style="width: 10%;text-align: center;color:white"(click)="upload()"  matTooltip="Edit" *ngIf="isUserActive">edit</mat-icon>
  
  </div>
`
})
export class UsernameComponent extends JsonFormsControl implements OnInit {
  formData: any = {};
  public isUserActive: boolean = true;

  public fileName: string = 'users.json';
  public data: any = {};
  public users: any = [];
  public username: string = '';
  public email: string = '';
  public currentUserEmail: string = '';
  constructor(private cdRef: ChangeDetectorRef,private snackBar: MatSnackBar,service: JsonFormsAngularService,private authService: AuthService, private dataService: DataService) {
    super(service);

  }

  ngOnInit() {
    this.getUserData();
  }
  

  getUsernameByEmail(users, email) {
    const user = users.find(user => user.email === email);
    return user ? user.username : null; // returns null if no user is found
  }

  getUserStatus(users, email) {
    const user = users.find(user => user.email === email);
    return user ? user.active : null; // returns null if no user is found
  }

  getUserData() {
    this.dataService.getData().subscribe(
      data => {
        if (data) {
          this.data = data;
          this.currentUserEmail = JSON.stringify(data).replace('.json', '');
          this.getUsers();
        }
      },
      error => {
        console.error("Error fetching data for user:", this.currentUserEmail, error);
        // Handle the error, e.g., show a notification to the user
      }
    );
  }


  async getUsers() {
    try {
      this.email = this.authService.auth.currentUser.email
      const users = await this.dataService.fetchUsers().toPromise();
      this.users = users;
      this.username = this.getUsernameByEmail(users, this.authService.auth.currentUser.email);
      this.isUserActive = this.getUserStatus(this.users, this.email) === true;
      this.cdRef.detectChanges();
      } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async upload() {
    if (!this.email) {
      console.error('No user is currently logged in.');
      return;
    }
    if (this.users.some(user => user.username === this.username && user.active == true)) {
      this.snackBar.open('Username already exists!', 'Close', {
        duration: 2000,  // The snackbar will auto-dismiss after 2 seconds
      });
      return;
    }
    this.dataService.updateUser(this.email, this.username,true).subscribe({
      next: (updatedUsers) => {
        this.snackBar.open('Username updated successfully!', 'Close', {
          duration: 2000,
        });
        if(!this.isUserActive){
          setTimeout(() => {
            window.location.reload();
          }, 2100); 
        }

      },
      error: (error) => {
        console.error("Error updating user:", error);
      }
    });
  }
}
