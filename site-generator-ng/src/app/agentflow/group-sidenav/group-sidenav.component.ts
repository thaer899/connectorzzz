import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ElementRef, ViewChild, AfterViewChecked, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-sidenav',
  templateUrl: './group-sidenav.component.html',
  styleUrls: ['./group-sidenav.component.css']
})
export class GroupSidenavComponent implements  OnInit, OnDestroy {
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;
  @Input() agents: any[] = [];
  @Input() isWSConnected: boolean = false;
  
  agentName: string = 'User_AI';
  agentProfile: string = '';
  groupAgents = new FormControl('');

  public loading: boolean = false;
  public messages: any = [];
  public chats: any = [];
  public chatId: string = '';
  public selectedAgents: any = [];

  constructor(private http: HttpClient,private snackBar: MatSnackBar, private wsService: WebsocketService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isWSConnected && changes.isWSConnected.currentValue) {
        this.listenToWebSocketMessages();
    }
    if (changes.agents && changes.agents.currentValue) {
      // Use a defensive copy to ensure change detection picks up changes
      this.groupAgents.setValue([...this.agents.map(agent => agent.agent_name)]);
      // Manually mark for check in case change detection does not catch this
      this.cd.markForCheck();
    }

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
            this.messages = [...this.messages, { 'name': messageObj.name, 'content': messageObj.content }];

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

  initiateGroupChat(message: string, agents: any[]): void {
    if (!this.isWSConnected) {
      this.connectToWebSocket();
      this.isWSConnected = true;
    }
      this.wsService.send(
      JSON.stringify({
        action: 'message_group',
        agent_name: agents.join(','),
        message:  message,
      })
    );
    if (agents.length == 1) {
    this.messages = [...this.messages, { 'name': 'User', 'content': message }];
    } else {
      this.messages = [...this.messages, { 'name': 'Manager', 'content': message }];
    }
  }

  createGroup(agents: any[]): void {
    if (!this.isWSConnected) {
      this.connectToWebSocket();
      this.isWSConnected = true;
    }
      this.wsService.send(
      JSON.stringify({
        action: 'message_group',
        agent_name: 'Manager',
        message: agents.join(',') ,
      })
    );
  }

  listenToWebSocketMessages(): void {
    this.wsService.messages$.subscribe(
      (messageStr) => {
        console.log("Received WebSocket message:", messageStr);
        const messageObj = JSON.parse(messageStr);
        if (messageObj && messageObj.name) {
          this.messages = [...this.messages, { 'name': messageObj.name, 'content': messageObj.content }];
        }else if (messageObj && !messageObj.name) {
          this.messages = [...this.messages, { 'name': 'Hint', 'content': messageStr }];
        }
        this.cd.detectChanges();
      },
      (error) => {
        console.error('WebSocket Error:', error);
      }
    );
  }

  runAgents(agents: any[]): void {
    if (!this.isWSConnected) {
      this.connectToWebSocket();
      this.isWSConnected = true;
    }

    for (let agent of agents) {
      this.wsService.send(
        JSON.stringify({
          action: 'start_agent',
          agent_name: agent.agent_name,
          message: agent.message,
        })
      );
    }
    this.snackBar.open('Started Agents', 'Close', {
      duration: 3000,
    });
   
  }

  
  getUserClass(userType: string): string {
    switch (userType) {
      case 'Hint': return 'default';
      case 'Bot': return 'bot';
      case this.agents[0].agent_name: return 'proxy';
      case 'Manager': return 'manager';
      case 'User': return 'user';
      default: return 'bot';
    }
  }

  getIcon(icon: string) {
    switch (icon) {
      case 'Hint': return 'info';
      case this.agents[0].agent_name: return 'supervised_user_circle';
      case 'Manager': return 'account_circle';
      case 'User': return 'person';
      default: return 'robot_2';
    }
  }


  onValueChange(newValue: string) {
    try {
      this.agents = JSON.parse(newValue);
      this.groupAgents.setValue(this.agents.map(agent => agent.agent_name));

    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  }
  
  isSelected(agentName: string): boolean {
    const selectedAgents = this.groupAgents.value;
    return selectedAgents.includes(agentName);
  }

  

  get agentsAsString(): string {
    return JSON.stringify(this.agents, null, 2);
  }

  set agentsAsString(value: string) {
    try {
      this.onValueChange(value);
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  }



  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.wsService.close();
  }


}
