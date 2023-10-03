import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  public post: any;
  public resume: any;
  public sidenavMode: 'side' | 'over' = 'side';
  public isLargeScreen = false;
  private mediaSubscription!: Subscription;
  public menuItems = [
    { key: 'employment', label: 'Employment' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'interests', label: 'Interests' },
    { key: 'languages', label: 'Languages' },
  ];

  constructor(
    private media: MediaObserver,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.dataService.fetchData().subscribe(data => {
      console.log("Data from DataService:", data);
      this.resume = data.resume;
    });

    this.mediaSubscription = this.media.asObservable()
      .subscribe((changes: MediaChange[]) => {
        this.isLargeScreen = changes.some(change => change.mqAlias === 'lg' || change.mqAlias === 'xl');
        this.adjustSidenavMode();
      });

    this.adjustSidenavMode();  // Ensure the mode is set even before a change happens
  }

  changeToMenu(menu: string): void {
    this.post = menu;
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
  }

  adjustSidenavMode(): void {
    this.sidenavMode = this.isLargeScreen ? 'side' : 'over';
  }
}
