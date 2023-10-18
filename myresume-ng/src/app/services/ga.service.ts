import { Injectable } from '@angular/core';
import { getAnalytics, logEvent } from 'firebase/analytics';

@Injectable({
  providedIn: 'root'
})
export class GAService {
  analytics: any;

  constructor() {
    this.analytics = getAnalytics();
  }

  logEvent(eventName: string, eventParams?: {}) {
    // Send the event to Firebase Analytics
    logEvent(this.analytics, eventName, eventParams);
  }

  trackPageView(title: string) {
    // Track a 'page_view' event with the given page title
    this.logEvent('page_view', { title: title });
  }
}
