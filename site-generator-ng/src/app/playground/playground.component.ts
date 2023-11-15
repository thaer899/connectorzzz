import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { ElementRef, ViewChild, AfterViewChecked, Renderer2, HostListener } from '@angular/core';
import { PlaygroundSidenavComponent } from './playground-sidenav/playground-sidenav.component';
import { PlaygroundGroupSidenavComponent } from './playground-group-sidenav/playground-group-sidenav.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaygroundFlowchartComponent } from './playground-flowchart/playground-flowchart.component';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToggleService } from '../services/toggle.service';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit, OnDestroy {
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;
  @ViewChild('sidenav') playgroundSidenavComponent: PlaygroundSidenavComponent;
  @ViewChild('groupsidenav') playgroundGroupSidenavComponent: PlaygroundGroupSidenavComponent;
  @ViewChild('flowchart') playgroundFlowChartComponent: PlaygroundFlowchartComponent;

  @ViewChild('agentsdrawer', { read: ElementRef }) agentsdrawer: ElementRef;
  @ViewChild('groupdrawer', { read: ElementRef }) groupdrawer: ElementRef;

  @ViewChild('leftresizeHandle', { read: ElementRef }) leftresizeHandle: ElementRef;
  @ViewChild('rightresizeHandle', { read: ElementRef }) rightresizeHandle: ElementRef;

  resizing: boolean = false;
  resizeDirection: 'left' | 'right';

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
  currentTheme = 'dark';

  constructor(
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private dataService: DataService,
    private authService: AuthService,
    private wsService: WebsocketService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toggleService: ToggleService,
    private titleService: Title) {
    this.renderer.addClass(document.body, 'dark-theme');
  }

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
      this.playgroundGroupSidenavComponent.isWSConnected = true;
      this.playgroundGroupSidenavComponent.chatId = this.chatId;
      this.playgroundGroupSidenavComponent.agents = this.playgroundSidenavComponent.agents;
      this.playgroundSidenavComponent.chatId = this.chatId;
      this.playgroundSidenavComponent.isWSConnected = true;

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

  @HostListener('mousedown', ['$event.target', '$event'])
  startResizing(target: HTMLElement, event: MouseEvent, direction: 'left' | 'right'): void {
    // Check if the target is the correct resize handle
    const isLeftHandle = target === this.leftresizeHandle.nativeElement;
    const isRightHandle = target === this.rightresizeHandle.nativeElement;

    if ((direction === 'left' && isLeftHandle) || (direction === 'right' && isRightHandle)) {
      event.preventDefault();
      this.resizing = true;
      this.resizeDirection = direction;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizing) {
      let newWidth;
      if (this.resizeDirection === 'right') {
        // Calculate new width for right resizing (groupdrawer)
        newWidth = window.innerWidth - event.clientX;
        this.groupdrawer.nativeElement.style.width = `${newWidth}px`;
      } else if (this.resizeDirection === 'left') {
        // Calculate new width for left resizing (agentsdrawer)
        newWidth = event.clientX;
        this.agentsdrawer.nativeElement.style.width = `${newWidth}px`;
      }
    }
  }

  // Function to stop resizing
  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.resizing = false;
  }


  toggleTheme(): void {
    this.renderer.removeClass(document.body, this.currentTheme + '-theme');
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.addClass(document.body, this.currentTheme + '-theme');
    console.log("Theme changed to:", this.currentTheme);
  }


}
