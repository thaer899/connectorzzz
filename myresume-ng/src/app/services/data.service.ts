import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { catchError, switchMap, tap } from 'rxjs/operators';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import data from './backup-data';

const firebaseConfig = environment.firebaseConfig;
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data = new BehaviorSubject<any>(null);
    public mainEmail = environment.mainEmail;
    constructor(
        private readonly http: HttpClient
    ) {
        this.fetchDataFromFirebase("").subscribe(); // Fetch data when service is instantiated
    }


    public getData(): Observable<any> {
        return this.data.asObservable();
    }

    public updateData(newData: any): void {
        this.data.next(newData);
    }

    private fetchDataFromFirebase(email: string): Observable<any> {
        if (email === "" || email === null || email === undefined) {
            email = this.mainEmail;
        }
        const fileRef = ref(storage, `profiles/${email}.json`);
        return from(getDownloadURL(fileRef)).pipe(
            switchMap(downloadURL => {
                if (typeof downloadURL === 'string') {
                    return this.http.get<any>(downloadURL).pipe(
                        tap(fetchedData => {
                            this.data.next(fetchedData);
                            // Update the BehaviorSubject with the fetched data
                        })
                    );
                } else {
                    // Handle the case where downloadURL is not a string
                    console.error('downloadURL is not a string:', downloadURL);
                    return of(null);
                }
            }),
            catchError(error => {
                console.error("Error getting download URL:", error);
                return of(null);  // Return a null observable in case of error
            })
        );
    }


    public fetchDataByEmail(email: string): Observable<any> {
        return this.fetchDataFromFirebase(email).pipe(
            tap(() => {
                return this.getData();
            })
        );
    }

    private fetchUsersFirebase(): Observable<any> {
        const fileRef = ref(storage, `users.json`);
        return from(getDownloadURL(fileRef)).pipe(
            switchMap(downloadURL => {
                if (typeof downloadURL === 'string') {
                    return this.http.get<any>(downloadURL).pipe(
                        tap(fetchedData => {
                            this.data.next(fetchedData);
                            // Update the BehaviorSubject with the fetched data
                        })
                    );
                } else {
                    // Handle the case where downloadURL is not a string
                    console.error('downloadURL is not a string:', downloadURL);
                    return of(null);
                }
            }),
            catchError(error => {
                console.error("Error getting download URL:", error);
                return of(null);  // Return a null observable in case of error
            })
        );
    }

    public fetchUsers(): Observable<any> {
        return this.fetchUsersFirebase().pipe(
            tap(() => {
                return this.getData();
            })
        );
    }

    public fetchData(): Observable<any> {
        return this.getData();
    }

}
