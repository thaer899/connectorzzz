import { Injectable,ChangeDetectorRef } from '@angular/core';
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Router } from '@angular/router'; // Import the Router
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    auth: Auth;

    constructor(private router: Router,private dataService: DataService) { // Inject the Router here
        this.auth = getAuth();
    }

    // Google login
// Google login
async loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.auth, provider);

        if (result.user) {
            // Check if username is empty before updating

            this.dataService.fetchUsers().subscribe({
                next: (users) => {
                    const user = users.find(u => u.email === result.user.email);
                    if (!user || !user.username) {
                        const username = result.user.email.split('@')[0];
                        this.dataService.createUser(result.user.email,username);
                        // If user does not exist or username is empty, update it
                        this.dataService.updateUser(result.user.email, result.user.email.split('@')[0],false).subscribe({
                            next: (updatedUsers) => {
                                console.log('User updated:', updatedUsers);
                                this.router.navigate(['/account-setup']); // Navigate after successful login
                            },
                            error: (error) => {
                                console.error("Error updating user:", error);
                            }
                        });
                    }
                    else {
                        this.router.navigate(['/admin']); // Navigate after successful login
                    }
                },
                error: (error) => {
                    console.error("Error fetching users:", error);
                }
            });
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
