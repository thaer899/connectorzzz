import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-autogen',
  templateUrl: './autogen.component.html',
  styleUrls: ['./autogen.component.scss']
})
export class AutogenComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  public messages: any = [];
  public chats: any = [];
  public chatId: string = '';

  constructor(private http: HttpClient, private wsService: WebsocketService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.connectToWebSocket();
  }

  connectToWebSocket(): void {
    this.http.get(`${environment.myAgentsURL}/get_chat_id`).subscribe((response: any) => {
      this.chatId = response.chat_id;
      const wsUrl = `${environment.myAgentsWS}/ws/${this.chatId}`;
      this.wsService.connect(wsUrl);

      this.wsService.messages$.subscribe(
        (messageStr) => {
          console.log("Received WebSocket message:", messageStr);
          const messageObj = JSON.parse(messageStr);
          if (messageObj) {
            this.messages.push({ 'name': messageObj.name, 'content': messageObj.content });
            this.loading = false;
          }
          this.cd.detectChanges();
        },
        (error) => {
          console.error('WebSocket Error:', error);
        }
      );

    });
  }

  initiateChat(message: string): void {
    this.loading = true;
    // Send the initial message via WebSocket
    this.wsService.send(message + '.');
    this.messages.push({ 'name': 'Me (Product_Manager)', 'content': message });
  }

  getUserClass(userType: string): string {
    switch (userType) {
      case 'Boss': return 'boss';
      case 'Boss_Assistant': return 'boss-assistant';
      case 'Senior_Python_Engineer': return 'senior-python-engineer';
      case 'Me (Product_Manager)': return 'product-manager';
      case 'Code_Reviewer': return 'code-reviewer';
      default: return '';
    }
  }

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.wsService.close();
  }
}
