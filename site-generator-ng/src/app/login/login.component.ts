import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private authService: AuthService) { }


  loginWithGoogle() {
    this.authService.loginWithGoogle().then(() => {
      this.router.navigate(['/admin']);
    }).catch(error => {
      console.error(error);
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().then(() => {
      this.router.navigate(['/admin']);
    }).catch(error => {
      console.error(error);
    });
  }

}
