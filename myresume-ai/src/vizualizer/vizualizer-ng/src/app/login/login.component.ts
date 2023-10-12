import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth: Auth = inject(Auth)

  constructor(private router: Router, private authService: AuthService) { }


  loginWithGoogle() {
    this.authService.loginWithGoogle().then(() => {
      this.router.navigate(['/console']);
    }).catch(error => {
      console.error(error);
    });
  }

}
