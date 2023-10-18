import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  isShow: boolean = false;
  topPosToStartShowing = 200;

  // Declare a member variable to hold the bound function
  private boundCheckScroll: any;

  constructor(private cd: ChangeDetectorRef) { }


  ngOnInit() {
    // Bind the function once and store the reference
    this.boundCheckScroll = this.checkScroll.bind(this);
    window.addEventListener('scroll', this.boundCheckScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.boundCheckScroll);
  }

  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }

  }


  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
