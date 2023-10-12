import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, from } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data = new BehaviorSubject<any>({});

    constructor(
        private readonly http: HttpClient,
        private readonly storage: AngularFireStorage
    ) {
        this.fetchDataForUser("").subscribe(); // Fetch data when service is instantiated
    }

    getData(): Observable<any> {
        return this.data.asObservable();
    }

    updateData(newData: any): void {
        this.data.next(newData);
    }

    public fetchDataForUser(email: string): Observable<any> {
        return this.fetchDataFromFirebase(email).pipe(
            catchError(_ => this.fetchDefaultData()), // If there's an error, fetch default data
            tap(data => this.data.next(data)) // Update the BehaviorSubject with the fetched data
        );
    }

    private fetchDataFromFirebase(email: string): Observable<any> {
        if (!email) {
            return this.fetchDefaultData();
        }
        console.log("Fetching data for user:", email);
        console.log("storage:", this.storage);

        const fileRef = this.storage.ref(`${email}.json`);  // Use this.storage.ref

        return fileRef.getDownloadURL().pipe(  // Use fileRef.getDownloadURL
            switchMap(downloadURL => this.http.get(downloadURL))
        );
    }

    private fetchDefaultData(): Observable<any> {
        const defaultFileRef = this.storage.ref('default.json');  // Use this.storage.ref

        return defaultFileRef.getDownloadURL().pipe(  // Use defaultFileRef.getDownloadURL
            switchMap(defaultDownloadURL => this.http.get(defaultDownloadURL))
        );
    }

}
