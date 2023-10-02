import { Injectable } from '@angular/core';
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Router } from '@angular/router'; // Import the Router
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    auth: Auth;

    constructor(private router: Router) { // Inject the Router here
        this.auth = getAuth();
    }

    // Google login
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(this.auth, provider);

            if (result.user) {
                this.router.navigate(['/admin']); // Navigate after successful login
            }

            return result;
        } catch (error) {
            console.error(error);
        }
    }

    // Facebook login
    async loginWithFacebook() {
        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(this.auth, provider);

            if (result.user) {
                this.router.navigate(['/admin']); // Navigate after successful login
            }

            return result;
        } catch (error) {
            console.error(error);
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
            this.router.navigate(['/login']);
        } catch (error) {
            console.error(error);
        }
    }
}
