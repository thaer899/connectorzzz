import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy,Output,Input, EventEmitter, SimpleChanges } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ElementRef, ViewChild, AfterViewChecked, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { cpuUsage } from 'process';
import { AuthService } from 'src/app/services/auth.service';

interface SkillEntry {
  type: string;
  list: [string];
}

interface EducationEntry {
  title: string;
  school: string;
  period: string;
  summary: string;
}

interface Post {
  title: string;
  date: string;
  summary: string;
}

interface EmploymentEntry {
  title: string;
  description: string;
  posts?: Post[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements  OnInit, OnDestroy {
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;
  @Input() isWSConnected: boolean = false;
  @Output() agentsChanged = new EventEmitter<any[]>();
  @Input() profile: any = {};



  showFiller = false;
  public loading: boolean = false;
  public users: any;
  public user: any;
  public messages: any = [];
  public chats: any = [];
  public agents: any = [];
  public actifAgent = '';
  public chatId: string = '';
  public selectedGroupName: string = 'Connectorzzz';
  public selectedAgentName: string = 'AgentX';
  public selectedAgentMessage: string = 'A reliable and knowledgeable aid with a knack for problem-solving.';

  public user_proxy : any = {}
  public userProxyName: string = 'User_Proxy';

  public agent : any = {}
  agentName: string = 'User_AI';
  agentProfile: string = '';

  constructor(private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService,
    private snackBar: MatSnackBar, private wsService: WebsocketService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getUsers();
    this.user = this.authService.auth.currentUser;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isWSConnected && changes.isWSConnected.currentValue) {
        this.listenToWebSocketMessages();
    }
    if (changes.profile && changes.profile.currentValue && this.profile.resume) {
      this.agentName = this.profile.resume.firstName+'_AI';
      this.userProxyName = this.profile.resume.firstName+'_Proxy';

      this.agentProfile = this.generateAgentProfile(this.profile);
      this.agent = {agent_name: this.agentName, message: this.agentProfile};
      this.user_proxy = {agent_name: this.userProxyName, message: 'A human admin. Interact with team on behalf of the user.! Reply `TERMINATE` in the end when everything is done.'};

      this.agents.unshift(this.user_proxy, this.agent);
      this.agentsChanged.emit(this.agents);

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
      this.agentsChanged.emit(this.agents);

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
    if (this.agents.length > 0) {
      this.agentsChanged.emit(this.agents);
    }
  } catch (error) {
    console.error("Invalid JSON format:", error);
  }
}

getUserDataByEmail(email: string) {
  console.log("Fetching data for user:", email);
  this.dataService.fetchDataForUser(email).subscribe(
    data => {
      if (data) {
        let profile = {agent_name: data.resume.firstName, message: this.generateAgentProfile(data)};

        this.agents = [...this.agents, profile];
        this.agentsChanged.emit(this.agents);
      }
    },
    error => {
      console.error("Error fetching data for user:", email, error);
      // Handle the error, e.g., show a notification to the user
    }
  );
}

getUsers() {
  this.dataService.getListOfUsers().subscribe(
    users => {
      this.users = users.filter(user => user !== `${this.user.email}.json`);
      console.log("Users fetched:", this.users);
    },
    error => {
      console.error("Error fetching users:", error);
      // Handle the error, e.g., show a notification to the user
    }
  );
}

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.wsService.close();
  }

  private generateAgentProfile(profileData: any): string {
    const educationEntries = profileData.education.map((edu: EducationEntry) => {
      return `- ${edu.title} at ${edu.school} (${edu.period}): ${edu.summary}`;
    }).join('\n');

    const SkillEntry = profileData.skills.map((skill: SkillEntry) => {
      return `- ${skill.type} in ${skill.list}`;
    }).join('\n');

    const employmentEntries = profileData.employment.map((job: EmploymentEntry) => {
      let jobEntry = `- ${job.title}: ${job.description}`;
      if (job.posts && job.posts.length > 0) {
        const postsEntries = job.posts.map((post: Post) => {
          return `  * ${post.title} (${post.date}): ${post.summary}`;
        }).join('\n');
        jobEntry += `\n${postsEntries}`;
      }
      return jobEntry;
    }).join('\n\n');

    return `
    As an AI agent named ${profileData.resume.firstName}, 
    your expertise is:
    ${SkillEntry}  
    Educational Background:
    ${educationEntries}  
    Employment History:
    ${employmentEntries}
  
    In your role, you collaborate with the teams, use your knowledge ${SkillEntry} and contribute your insights to discussions and documentation.
  
    Efficiency and effectiveness are your guiding principles. You are tasked with delivering succinct solutions, eschewing all pleasantries and focusing solely on the objectives at hand.
    Reply "TERMINATE" in the end when everything is done.

    `.trim();
  
  }


  get agentsAsString(): string {
    return JSON.stringify(this.agents, null, 2);
  }

  set agentsAsString(value: string) {
    try {
      this.agents = JSON.parse(value);
      this.agents.unshift(this.user_proxy, this.agent);
      this.onValueChange(value);
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  }

}
