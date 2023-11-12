import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, uploadString } from "firebase/storage";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import TemplateProfile from 'src/app/services/template.profile'

const firebaseConfig = environment.firebaseConfig;
const app = initializeApp(firebaseConfig); // Initialize Firebase app once
const storage = getStorage(app);

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data = new BehaviorSubject<any>({});
  private usersSource = new BehaviorSubject<any[]>([]);
  public users$ = this.usersSource.asObservable();
  public templateProfile = new TemplateProfile();
  constructor(
    private readonly http: HttpClient
  ) {
    this.initializeUsers();
  }

  getData(): Observable<any> {
    return this.data.asObservable();
  }

  updateData(newData: any): void {
    this.data.next(newData);
  }

  private initializeUsers() {
    this.fetchAndStoreUsers().subscribe({
      next: (users) => {
      },
      error: (error) => {
        console.error('Error during user initialization:', error);
      }
    });
  }



  public createUser(email: string, username: string) {
    const fileRef = ref(storage, `profiles/${email}.json`);
    this.templateProfile.email = email;
    this.templateProfile.username = username;
    this.templateProfile.theme = {
      "colors": [
        {
          "key": "themecolor",
          "value": "#1D1D35"
        },
        {
          "key": "themecoloralt",
          "value": "#adb2b7"
        },
        {
          "key": "topbar",
          "value": "#adb2b7"
        },
        {
          "key": "sidebar",
          "value": "#adb2b7"
        },
        {
          "key": "bodycolor",
          "value": "#F5F5F5"
        },
        {
          "key": "bodytext",
          "value": "#1D1D35"
        }
      ]
    };
    const profileString = JSON.stringify(this.templateProfile)
    uploadString(fileRef, profileString).then(() => {
    }).catch(error => {
      console.error("Error creating user profile:", error);
    });
    return email;
  }

  public updateUser(email: string, username: string, active: boolean): Observable<any> {
    return this.users$.pipe(
      take(1), // Take the current value without waiting for it to change
      map(users => {
        const updatedUsers = users.some(user => user.email === email)
          ? users.map(user => user.email === email ? { ...user, username, active: active } : user)
          : [...users, { email, username, active: active }];
        this.saveUsers(updatedUsers);
        return updatedUsers;
      })
    );
  }


  public fetchAndStoreUsers(): Observable<any> {
    const defaultFileRef = ref(storage, 'users.json');
    return from(getDownloadURL(defaultFileRef)).pipe(
      switchMap(defaultDownloadURL => this.http.get<any[]>(defaultDownloadURL)),
      tap(users => this.usersSource.next(users)), // Store the fetched users in the BehaviorSubject
      catchError(error => {
        console.error("Error fetching users:", error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  public fetchUsers(): Observable<any> {
    return this.fetchDataFromFirebase(`users.json`).pipe(
      tap(data => this.data.next(data))
    );
  }

  private saveUsers(users: any[]): void {
    const fileRef = ref(storage, 'users.json');
    const dataString = JSON.stringify(users);
    uploadString(fileRef, dataString).then(() => {
    }).catch(error => {
      console.error("Error saving users:", error);
    });
  }

  private saveUser(user: any): void {
    const fileRef = ref(storage, `profiles/${user}.json`);
    const dataString = JSON.stringify(this.data.value);
    uploadString(fileRef, dataString).then(() => {
    }).catch(error => {
      console.error("Error saving user:", error);
    });
  }


  public fetchDataForUser(email: string): Observable<any> {
    return this.fetchDataFromFirebase(`profiles/${email}.json`).pipe(
      catchError(_ => this.fetchDefaultData()),
      tap(data => this.data.next(data))
    );
  }


  public fetchFunctions(): Observable<any> {
    return this.fetchDataFromFirebase("functions.json").pipe(
      tap(data => this.data.next(data))
    );
  }

  public saveFunctions(functions: any[]): void {
    const fileRef = ref(storage, 'functions.json');
    const dataString = JSON.stringify(functions);
    uploadString(fileRef, dataString).then(() => {
    }).catch(error => {
      console.error("Error saving users:", error);
    });
  }
  private fetchDataFromFirebase(email: string): Observable<any> {
    const fileRef = ref(storage, email);

    return from(getDownloadURL(fileRef)).pipe(
      switchMap(downloadURL => this.http.get(downloadURL)),
      catchError((error) => {
        return of(null);
      })
    );
  }

  private fetchDefaultData(): Observable<any> {
    const defaultFileRef = ref(storage, 'template.json');

    return from(getDownloadURL(defaultFileRef)).pipe(
      switchMap(defaultDownloadURL => this.http.get(defaultDownloadURL))
    );
  }
}
