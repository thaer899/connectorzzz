import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import OpenAI from 'openai';
import { catchError, throwError } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GAService } from 'src/app/services/ga.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss']
})
export class AskComponent implements OnInit {

  public email: string;
  public recipientMessage: string;
  public chatCompletion: any;
  public messageForm: FormGroup;
  public messageURL: string;
  public response: any;
  public chatConversation: any;
  public info: any;
  public available: boolean = true;
  public isBotMessage: boolean = false;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: "modal fade"
  };

  constructor(
    private readonly http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private titleService: Title,
    private gaService: GAService,
    private dataService: DataService
  ) {
    this.messageForm = this.fb.group({
      recipientMessage: ''
    });

    this.chatCompletion = [];
    this.chatConversation = [];
    this.recipientMessage = '';
    this.info = {};
  }


  ngOnInit(): void {
    this.subscribeToRouteData();
    this.subscribeToRouteParamMap();
  }

  private subscribeToRouteData(): void {
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);
        this.gaService.trackPageView(data.title);
      }
    });
  }

  private subscribeToRouteParamMap(): void {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');

      this.email = email ? email : environment.mainEmail;
      const dataServiceObservable = email ? this.dataService.fetchDataByEmail(email) : this.dataService.fetchData();

      dataServiceObservable.subscribe(data => {
        this.setBotMessageFlag(data);
      });
    });
  }

  private setBotMessageFlag(data: any): void {
    if (data.bots && data.bots.some(bot => bot.type === 'messages')) {
      this.isBotMessage = true;
    }
  }



  openModal(template: TemplateRef<any>) {
  }

  message() {
    this.available = false;
    this.recipientMessage = this.messageForm.get('recipientMessage')?.value;

    const headers = {
      'Content-Type': 'application/json',
      'apiKey': environment.message_api_key
    };

    const options = {
      headers: new HttpHeaders(headers),
      params: new HttpParams().set('email', this.email)
    };

    const body = {
      recipientMessage: this.recipientMessage
    };

    // const emailParam = encodeURIComponent(environment.mainEmail);
    // const templateTypeParam = encodeURIComponent('message');
    // const messageURL = `${environment.functionURL}openai?email=${emailParam}&templateType=${templateTypeParam}`;

    if (this.recipientMessage) {
      const messageURL = environment.functionURL + '/message';
      this.http.post(messageURL, body, options).pipe(
        catchError((error) => {
          console.error('Error sending message', error);
          this.available = true; // Show the message form and hide the spinner on error
          this.changeDetectorRef.detectChanges();
          return throwError(() => new Error('Error sending message'));
        })
      ).subscribe((response: any) => {
        this.available = true; // Show the message form and hide the spinner on success
        this.changeDetectorRef.detectChanges();
        this.chatCompletion = response;
        this.chatConversation = this.chatCompletion.choices;
      });
    } else {
      this.available = true; // Show the message form and hide the spinner if there's no message
    }
  }
}
