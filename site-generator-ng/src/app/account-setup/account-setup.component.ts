import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-setup',
  template: `
    <div class="centered-container">
      <p class="centered-text">Setting up your account, please wait...</p>
    </div>
  `,
  styles: [`
    .centered-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: black;
    }
    .centered-text {
      font-weight: bold;
      color: white;
      margin: 0;
    }
  `]
})
export class AccountSetupComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/admin'])
    }, 1000); 
  }
}
