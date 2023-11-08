import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { ElementRef, ViewChild, AfterViewChecked, Renderer2, HostListener } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { GroupSidenavComponent } from './group-sidenav/group-sidenav.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToggleService } from '../services/toggle.service';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
@Component({
  selector: 'app-agentflow',
  templateUrl: './agentflow.component.html',
  styleUrls: ['./agentflow.component.scss']
})
export class AgentflowComponent implements OnInit, OnDestroy {
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;
  @ViewChild('sidenav') sidenavComponent: SidenavComponent;
  @ViewChild('groupsidenav') groupSidenavComponent: GroupSidenavComponent;
  @ViewChild('flowchart') flowChartComponent: FlowchartComponent;

  @ViewChild('groupdrawer', { read: ElementRef }) groupdrawer: ElementRef;

  @ViewChild('resizeHandle', { read: ElementRef }) resizeHandle: ElementRef;

  private resizing: boolean = false;

  events: string[] = [];

  public agents: any = [];
  public chatId: string = '';
  public isWSConnected: boolean = false;
  public messages: any = [];
  public data: any = {};
  showContent: boolean = false;
  isAdmin: boolean = false;
  public user: any;
  public fileName: string;
  public groupDrawerOpen = false;
  private subscription: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    private authService: AuthService,
    private wsService: WebsocketService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toggleService: ToggleService,
    private titleService: Title) { }

  ngOnInit() {
    this.subscription = this.toggleService.state$.subscribe(isOpen => {
      this.groupDrawerOpen = isOpen;

    });
    this.connectToWebSocket();
    if (this.isWSConnected) {
      this.listenToWebSocketMessages();
    }
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);;
      }
    });
    this.user = this.authService.auth.currentUser;
    if (this.user) {
      this.showContent = true;
      this.isAdmin = this.user.email === environment.mainEmail;
      // Fetch data on component initialization
      console.log("Fetching data for user:", this.user.email);
      this.ngZone.run(() => {
        this.dataService.fetchDataForUser(this.user.email).subscribe(
          data => {
            if (data) {
              this.data = data;
              console.log("data", data);
              this.cd.detectChanges();  // Trigger change detection
            }
          },
          error => {
            console.error("Error fetching data for user:", this.user.email, error);
            // Handle the error, e.g., show a notification to the user
          }
        );
      })
    }
  }


  ngOnChanges(): void {
    if (this.isWSConnected) {
      this.groupSidenavComponent.isWSConnected = true;
      this.groupSidenavComponent.chatId = this.chatId;
      this.groupSidenavComponent.agents = this.sidenavComponent.agents;
      this.sidenavComponent.chatId = this.chatId;
      this.sidenavComponent.isWSConnected = true;

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
      this.isWSConnected = true;
      this.snackBar.open('Connected', 'Close', {
        duration: 5000,
      });

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

  updateAgents(newAgents: any[]) {
    this.agents = newAgents;
  }

  closeWebSocket(): void {
    this.wsService.close();
    this.isWSConnected = false;
    this.snackBar.open('Disconnected', 'Close', {
      duration: 5000,
    });
  }

  ngOnDestroy() {
    this.wsService.close();
    this.subscription.unsubscribe();

  }
  // Function to start resizing
  @HostListener('mousedown', ['$event.target'])
  startResizing(target: HTMLElement, event: MouseEvent): void {
    // Make sure the mousedown event is on the resize handle
    if (target === this.resizeHandle.nativeElement) {
      event.preventDefault();
      this.resizing = true;
    }
  }

  // Function to resize the drawer
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizing) {
      // Calculate the new width based on the mouse position
      const newWidth = window.innerWidth - event.clientX;

      // Set the width of the drawer
      this.groupdrawer.nativeElement.style.width = `${newWidth}px`;
    }
  }

  // Function to stop resizing
  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.resizing = false;
  }

}
