import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import OpenAI from 'openai';
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


  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);
        this.gaService.trackPageView(data.title);
      }
    });
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');

      if (!email) {
        this.email = environment.mainEmail;
        this.dataService.fetchData().subscribe(data => {
          if (data.bots && data.bots.some(bot => bot.type === 'messages')) {
            this.isBotMessage = true;
          }
        });
      } else {
        this.email = email;
        this.dataService.fetchDataByEmail(email).subscribe(data => {
          if (data.bots && data.bots.some(bot => bot.type === 'messages')) {
            this.isBotMessage = true;
          }
        });
      }
    });
  }


  openModal(template: TemplateRef<any>) {
  }

  message() {
    this.available = false;
    this.recipientMessage = this.messageForm.get('recipientMessage')?.value;

    const headers = {
      'Content-Type': 'application/json',
      'API_KEY': environment.message_api_key
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
      const messageURL = environment.functionURL + 'message';
      this.http.post(messageURL, body, options).subscribe((response: any) => {
        if (response) {
          this.available = true;
          this.chatCompletion = response;
          this.chatConversation = this.chatCompletion.choices;
        }
      });
    }
  }

}
