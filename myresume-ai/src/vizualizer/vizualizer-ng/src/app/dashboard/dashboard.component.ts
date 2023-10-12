import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public data = {};
  private user: any;
  showContent: boolean = false;

  constructor(private dataService: DataService, private authService: AuthService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.user = this.authService.isAuthenticated() && this.authService;
    console.log("this.user:", this.user);
    this.user = this.user.auth.currentUser;
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


}
