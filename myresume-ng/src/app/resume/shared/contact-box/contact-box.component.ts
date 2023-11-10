import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import OpenAI from 'openai';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-box',
  templateUrl: './contact-box.component.html',
  styleUrls: ['./contact-box.component.scss']
})
export class ContactBoxComponent implements OnInit {

  public recipientMessage: string;
  public chatCompletion: any;
  public messageForm: FormGroup;
  public email: string;
  public mainEmail: string = environment.mainEmail;
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
    private readonly router: Router,
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
      }
      else {
        this.email = this.mainEmail;
      }
    });

  }



  openModal(template: TemplateRef<any>) {
  }

  openFullChat() {
    this.router.navigate(['/ask']);
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

    if (this.recipientMessage) {
      const messageURL = environment.functionURL + '/message';
      this.http.post(messageURL, body, options).pipe(
        catchError(error => {
          console.error('Error sending message', error);
          this.available = true;
          this.changeDetectorRef.detectChanges();
          return throwError(error);
        })
      ).subscribe((response: any) => {
        this.available = true;
        this.changeDetectorRef.detectChanges();
        if (response) {
          this.chatCompletion = response;
          this.chatConversation = this.chatCompletion.choices;
        }
      });
    }
  }



}
