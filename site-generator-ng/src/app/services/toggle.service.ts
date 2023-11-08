import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  private drawerState = new BehaviorSubject<boolean>(false);

  toggleDrawer(): void {
    this.drawerState.next(!this.drawerState.value);
    console.log('Drawer state is now:', this.drawerState.value);

  }

  get state$() {
    return this.drawerState.asObservable();
  }
}
