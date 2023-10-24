import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  private messagesSubject = new Subject<string>();
  public messages$ = this.messagesSubject.asObservable();

  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds
  private readonly MAX_RETRIES = 5;
  private currentRetries = 0;
  private intentionalClose = false;

  connect(url: string): void {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.connectionStatusSubject.next(true);
        this.currentRetries = 0; // reset retries count on successful connection
      };

      this.socket.onmessage = (event) => {
        this.messagesSubject.next(event.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.socket.onclose = (event) => {
        this.connectionStatusSubject.next(false);
        if (event.wasClean) {
          console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          console.error('Connection died');
        }
        if (!this.intentionalClose && this.currentRetries < this.MAX_RETRIES) {
          setTimeout(() => this.connect(url), this.RECONNECT_INTERVAL);
          this.currentRetries++;
        }
      };
    }
  }

  send(data: string): void {
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.send(data);
    } else {
      console.error('WebSocket is not open. Cannot send data');
      // Optionally, add data to a queue here
    }
  }

  close(): void {
    this.intentionalClose = true;
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.close();
    }
  }
}
