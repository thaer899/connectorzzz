import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { ElementRef, ViewChild, AfterViewChecked, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;
  @Input() isWSConnected: boolean = false;

  public loading: boolean = false;
  public messages: any = [];
  public chats: any = [];
  public chatId: string = '';

  constructor(private http: HttpClient, private wsService: WebsocketService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.connectToWebSocket();
    this.isWSConnected = true;

  }

  connectToWebSocket(): void {
    const headers = {
      'Content-Type': 'application/json',
      'apiKey': environment.functionApiKey
    };
    this.http.get(`${environment.agentFlowURL}/get_chat_id`, { headers }).subscribe((response: any) => {
      this.chatId = response.chat_id;
      const wsUrl = `${environment.agentFlowWS}/ws/${this.chatId}`;
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

  listenToWebSocketMessages(): void {
    this.wsService.messages$.subscribe(
      (messageStr) => {
        console.log("Received WebSocket message:", messageStr);
        const messageObj = JSON.parse(messageStr);
        if (messageObj) {
          this.messages.push({ 'name': messageObj.name, 'content': messageObj.content });
        }
        this.cd.detectChanges();
      },
      (error) => {
        console.error('WebSocket Error:', error);
      }
    );
  }

  initiateChat(message: string): void {
    this.loading = true;
    // Send the initial message via WebSocket
    this.wsService.send(message + '.');
    this.messages.push({ 'name': 'Me (Product_Manager)', 'content': message });
  }

  initiateGroupChat(message: string, agents: any[]): void {
    if (!this.isWSConnected) {
      this.connectToWebSocket();
      this.isWSConnected = true;
    }
    this.wsService.send(
      JSON.stringify({
        action: 'message_group',
        agents: agents.join(','),
        message: message,
      })
    );
    if (agents.length == 1) {
      this.messages = [...this.messages, { 'name': 'User', 'content': message }];
    } else {
      this.messages = [...this.messages, { 'name': 'Manager', 'content': message }];
    }
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
