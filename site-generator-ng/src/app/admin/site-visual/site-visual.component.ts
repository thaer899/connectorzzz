import { ChangeDetectorRef, Component, Input, NgZone, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-site-visual',
  templateUrl: './site-visual.component.html',
  styleUrls: ['./site-visual.component.css']
})
export class SiteVisualComponent implements OnInit {
  @Input() dataFromParent: any;
  @Output() colorChange = new EventEmitter<string>();

  public colors: any = [];
  public data = [];
  public profile: any;
  private user: any;
  public fileName: string;
  constructor(private cdRef: ChangeDetectorRef, private dataService: DataService, private ngZone: NgZone, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.auth.currentUser;
    this.ngZone.run(() => {
      this.dataService.fetchDataForUser(this.user.email).subscribe(
        data => {
          if (data) {
            this.data = data.theme.colors;
            this.profile = data.resume
            this.colors = this.data;
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

  ngOnChanges(event): void {
    if (this.dataFromParent && Object.keys(this.dataFromParent).length !== 0) {
      this.data = this.dataFromParent.theme.colors;
      this.profile = this.dataFromParent.resume

    }
  }
  getColor(key: string): string {
    let obj = this.data.find(item => item.key === key);
    return obj ? obj.value : '#FFFFFF'; // default to white if not found
  }

  visualize(data: any) {
    this.data = this.colors;
    this.colors = data;
  }

}


