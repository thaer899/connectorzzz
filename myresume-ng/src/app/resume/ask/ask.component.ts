import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import OpenAI from 'openai';
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
    private route: ActivatedRoute
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
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');

      if (email) {
        this.email = email;
      } else {
        this.email = environment.mainEmail;
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
