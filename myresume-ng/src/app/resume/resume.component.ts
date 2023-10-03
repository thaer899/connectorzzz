import { HttpClient } from '@angular/common/http';
import { HostListener, Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormBuilder } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  providers: []
})
export class ResumeComponent implements OnInit, OnChanges {
  public post: any;
  public data: any;
  public resume: any;
  public quote: string;
  public sidenavMode: 'over' | 'push' | 'side' = 'side';
  public isLargeScreen: boolean = true;
  public sidenavOpened: boolean = true;

  public menuItems = [
    { key: 'employment', label: 'Employment' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'interests', label: 'Interests' },
    { key: 'languages', label: 'Languages' },
  ];
  private breakpointSubscription: Subscription;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  options = this._formBuilder.group({
    bottom: 0,
    fixed: true,
    top: 0,
  });

  constructor(
    private breakpointObserver: BreakpointObserver,
    private media: MediaObserver,
    private _formBuilder: FormBuilder,
    private readonly dataService: DataService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.post = router.url.replace('/resume/', '');
    this.quote = "\"Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.\" - Christian D. Larson";
  }

  ngOnInit() {
    this.dataService.fetchData().subscribe(data => {
      console.log("Data from DataService:", data);
      this.resume = data.resume;
    });
    this.breakpointSubscription = this.breakpointObserver.observe([
      '(min-width: 600px)'
    ]).subscribe(result => {
      this.isLargeScreen = result.matches;
      this.sidenavMode = this.isLargeScreen ? 'side' : 'over';
    });
  }

  ngOnChanges() {
    // Add code here if needed
  }

  changeToMenu(menu: string) {
    this.post = menu;
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustSidenavMode();
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

  adjustSidenavMode(): void {
    this.sidenavMode = this.isLargeScreen ? 'push' : 'over';
    console.log('Is Large Screen:', this.isLargeScreen);
    console.log('Sidenav Mode:', this.sidenavMode);
  }

  scrollToTop() {
    const content = document.getElementById('content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
