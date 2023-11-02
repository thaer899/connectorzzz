import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy,Output,Input, EventEmitter, SimpleChanges } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ElementRef, ViewChild, AfterViewChecked, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements  OnInit, OnDestroy {
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;
  @Input() isWSConnected: boolean = false;


  showFiller = false;
  public loading: boolean = false;
  public messages: any = [];
  public chats: any = [];
  public agents: any = [];
  public actifAgent = '';
  public chatId: string = '';
  public selectedGroupName: string = 'Connectorzzz';
  public selectedAgentName: string = 'AgentX';
  public selectedAgentMessage: string = 'A reliable and knowledgeable aid with a knack for problem-solving.';

  constructor(private http: HttpClient,private snackBar: MatSnackBar, private wsService: WebsocketService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isWSConnected && changes.isWSConnected.currentValue) {
        this.listenToWebSocketMessages();
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
    this.wsService.isConnected$.subscribe((isConnected) => {
      this.isWSConnected = isConnected;
    });
  }

  
  listenToWebSocketMessages(): void {
    this.wsService.messages$.subscribe(
      (messageStr) => {
        console.log("Received WebSocket message:", messageStr);
        const messageObj = JSON.parse(messageStr);
        if (messageObj && messageObj.name) {
          this.messages.push({ 'name': messageObj.name, 'content': messageObj.content });
          this.loading = false;
        }else if (messageObj && !messageObj.name) {
          this.messages.push({ 'name': 'Hint', 'content': messageStr });
          this.loading = false;
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
    this.wsService.send(
      JSON.stringify({
        action: 'send_message',
        agent_name: this.actifAgent,
        message: message,
      })
    );
    this.messages.push({ 'name': 'Me (Product_Manager)', 'content': message });
  }

  runAgent(message: string, agent_name: string): void {
    if (!this.isWSConnected) {
      this.connectToWebSocket();
      this.isWSConnected = true;
    }

      const agentExists = this.agents.some(agent => agent.agent_name === agent_name);  
    if (!agentExists) {
      let newAgent = { 'agent_name': agent_name, 'message': message };
      this.agents = [...this.agents, newAgent];
    } else {
      console.log('Agent already exists. Not adding.'); 
    }
  
  
    this.actifAgent = agent_name;
    this.wsService.send(
      JSON.stringify({
        action: 'start_agent',
        agent_name: agent_name,
        message: message,
      })
    );
    this.snackBar.open('Started Agent', 'Close', {
      duration: 3000,
    });
  }
  
  
  

  getUserClass(userType: string='Default'): string {
    switch (userType) {
      case 'Hint': return 'default';
      case 'Boss': return 'boss';
      case 'Boss_Assistant': return 'boss-assistant';
      case 'Senior_Python_Engineer': return 'senior-python-engineer';
      case 'Me (Product_Manager)': return 'product-manager';
      case 'Code_Reviewer': return 'code-reviewer';
      default: return 'boss';
    }
  }

  updateSelectedAgentValues(): void {
    const selectedAgent = this.agents.find(agent => agent.agent_name === this.actifAgent);
    if (selectedAgent) {
        this.selectedAgentName = selectedAgent.agent_name;
        this.selectedAgentMessage = selectedAgent.message;
    }
}

onValueChange(newValue: string) {
  try {
    this.agents = JSON.parse(newValue);

  } catch (error) {
    console.error("Invalid JSON format:", error);
  }
}


get agentsAsString(): string {
  return JSON.stringify(this.agents, null, 2);
}

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.wsService.close();
  }

}
