import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import OpenAI from 'openai';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.css']
})
export class AskComponent implements OnInit {

  public recipentMessage: string;
  public chatCompletion: any;
  public messageForm: FormGroup;
  public messageURL: string;
  public response: any;
  public chatConversation: any;
  public info: any;
  public available: boolean = true;
  modalRef?: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: "modal fade"
  };

  constructor(
    private readonly http: HttpClient,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({
      recipentMessage: ''
    });

    this.chatCompletion = [];
    this.chatConversation = [];
    this.recipentMessage = '';
    this.info = {};
  }

  ngOnInit() { }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  message() {
    this.available = false;
    this.recipentMessage = this.messageForm.get('recipentMessage')?.value;

    const headers = {
      'Content-Type': 'application/json',
      'API_KEY': environment.message_api_key
    };

    const options = {
      headers: new HttpHeaders(headers),
      params: new HttpParams().set('email', environment.mainEmail)
    };

    const body = {
      recipentMessage: this.recipentMessage
    };

    if (this.recipentMessage) {
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
