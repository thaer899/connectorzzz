import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const firebaseConfig = environment.firebaseConfig;
const app = initializeApp(firebaseConfig); // Initialize Firebase app once
const storage = getStorage(app);

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data = new BehaviorSubject<any>({});

    constructor(
        private readonly http: HttpClient
    ) {
        this.fetchDataForUser("").subscribe(); // Fetch data when service is instantiated
    }

    getData(): Observable<any> {
        return this.data.asObservable();
    }

    updateData(newData: any): void {
        this.data.next(newData);
    }

    public getListOfUsers(): Observable<any> {
        // the list of files in the storage bucket
        const listRef = ref(storage, '/');
        return from(listAll(listRef)).pipe(
            switchMap(listResult => {
                const users = listResult.items.map(item => item.name);
                return of(users);  // Wrap the array inside an Observable
            })
        );
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

        const fileRef = ref(storage, `${email}`);

        return from(getDownloadURL(fileRef)).pipe(
            switchMap(downloadURL => this.http.get(downloadURL))
        );
    }

    private fetchDefaultData(): Observable<any> {
        const defaultFileRef = ref(storage, 'template.json');

        return from(getDownloadURL(defaultFileRef)).pipe(
            switchMap(defaultDownloadURL => this.http.get(defaultDownloadURL))
        );
    }
}
