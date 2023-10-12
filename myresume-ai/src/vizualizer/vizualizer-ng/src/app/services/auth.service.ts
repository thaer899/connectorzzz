import { Injectable } from '@angular/core';
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router'; // Import the Router
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private auth: Auth) { // Inject the Router here
    this.auth = getAuth();
  }

  // Google login
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      if (result.user) {
        this.router.navigate(['/console']); // Navigate after successful login
      }

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Facebook login
  async loginWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        this.router.navigate(['/console']); // Navigate after successful login
      }

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      onAuthStateChanged(this.auth, user => {
        if (user) {
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      });
    });
  }

  // Logout
  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error(error);
    }
  }
}
