import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import data from './backup-data';

const firebaseConfig = environment.firebaseConfig;
const app = initializeApp(firebaseConfig); // Initialize Firebase app once
const storage = getStorage(app);

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data = new BehaviorSubject<any>(data);
    public mainEmail = environment.mainEmail;
    constructor(
        private readonly http: HttpClient
    ) {
        this.fetchDataFromFirebase(""); // Fetch data when service is instantiated
    }

    public getData(): Observable<any> {
        return this.data.asObservable();
    }

    public updateData(newData: any): void {
        this.data.next(newData);
    }

    private fetchDataFromFirebase(email: string): void {
        if (email === "") {
            email = this.mainEmail
        }
        const fileRef = ref(storage, `${email}.json`);
        getDownloadURL(fileRef).then(downloadURL => {
            this.http.get(downloadURL).subscribe(data => {
                console.log("Data from Firebase Storage:", data);
                this.data.next(data); // Update the BehaviorSubject with the fetched data
            });
        }).catch(error => {
            console.error("Error getting download URL:", error);
        });
    }

    public fetchDataByEmail(email: string): Observable<any> {
        this.fetchDataFromFirebase(email);
        return this.getData();
    }

    public fetchData(): Observable<any> {
        return this.getData();
    }

}
