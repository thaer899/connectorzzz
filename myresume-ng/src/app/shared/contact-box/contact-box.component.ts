import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import OpenAI from 'openai';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contact-box',
  templateUrl: './contact-box.component.html',
  styleUrls: ['./contact-box.component.css']
})
export class ContactBoxComponent implements OnInit {

  public recipentMessage: string;
  public chatCompletion: any;
  public messageForm: FormGroup;

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

  openFullChat() {
    this.modalService.hide();
  }

  message() {
    this.available = false;
    this.recipentMessage = this.messageForm.get('recipentMessage')?.value;
    const headers = {
      'Content-Type': 'application/json',
      'API_KEY': environment.message_api_key
    }
    if (this.recipentMessage) {
      this.http.post(environment.messageURL, { recipentMessage: this.recipentMessage }, { headers }).subscribe((response: any) => {
        if (response) {
          this.available = true;
          this.chatCompletion = response;
          this.chatConversation = this.chatCompletion.choices;
        }
      })
    }
  }


}
